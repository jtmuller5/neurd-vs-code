import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

// Import settings management
import { getProjectPath } from "./settings";

/**
 * Gets the workspace root path
 * This is now a wrapper around getProjectPath for backward compatibility
 */
export async function getWorkspaceRoot(): Promise<string | undefined> {
  return getProjectPath();
}

/**
 * Creates directory if it doesn't exist
 */
export function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Reads a template file and returns its content
 */
export async function readTemplate(
  templateType: string
): Promise<string | undefined> {
  const workspaceRoot = await getWorkspaceRoot();
  if (!workspaceRoot) return undefined;

  const possibleTemplatePaths = [
    // Try in standard templates directory
    path.join(workspaceRoot, "templates", `${templateType}.md`),
    // Try in .templates directory (hidden)
    path.join(workspaceRoot, ".templates", `${templateType}.md`),
    // Try at project root
    path.join(workspaceRoot, `${templateType}.md`),
    // Try in .vscode directory
    path.join(workspaceRoot, ".vscode", `${templateType}.md`),
  ];

  // Try to find the template in various locations
  for (const templatePath of possibleTemplatePaths) {
    if (fs.existsSync(templatePath)) {
      return fs.readFileSync(templatePath, "utf8");
    }
  }

  // Template doesn't exist anywhere, create a default one
  return createDefaultTemplate(templateType);
}

/**
 * Creates a default template if none exists
 */
function createDefaultTemplate(templateType: string): string {
  switch (templateType) {
    case "daily":
      return `# Daily Journal: \${date}

## Morning Reflection
- 

## Tasks for Today
- [ ] 

## Notes and Insights
- 

## Evening Reflection
- 

## Tomorrow's Focus
- 
`;
    case "weekly":
      return `# Weekly Review: \${date}

## Accomplishments
- 

## Challenges
- 

## Insights and Learnings
- 

## Next Week's Focus Areas
- 

## Action Items
- [ ] 
`;
    case "note":
      return `# \${title}
*Created: \${datetime}*

## Overview

## Key Points
- 

## Related Notes
- 
`;
    default:
      return `# New Note: \${date}

## Content
- 
`;
  }
}

/**
 * Formats the template content with date variables
 */
export function formatTemplate(
  template: string,
  customVars: Record<string, string> = {}
): string {
  const now = new Date();

  // Create various date formats
  const isoDate = now.toISOString().split("T")[0]; // YYYY-MM-DD
  const formattedTime = now.toLocaleTimeString();

  // Create MM-DD-YYYY format
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const year = now.getFullYear();
  const mmddyyyyDate = `${month}-${day}-${year}`;

  let result = template
    // Handle ${var} style variables
    .replace(/\${date}/g, isoDate)
    .replace(/\${time}/g, formattedTime)
    .replace(/\${datetime}/g, `${isoDate} ${formattedTime}`)

    // Handle {var} style variables (more user-friendly)
    .replace(/{date}/g, mmddyyyyDate)
    .replace(/{isodate}/g, isoDate)
    .replace(/{time}/g, formattedTime)
    .replace(/{datetime}/g, `${mmddyyyyDate} ${formattedTime}`)
    .replace(/{year}/g, year.toString())
    .replace(/{month}/g, month)
    .replace(/{day}/g, day);

  // Replace any custom variables (support both styles)
  for (const [key, value] of Object.entries(customVars)) {
    result = result
      .replace(new RegExp(`\\$\\{${key}\\}`, "g"), value)
      .replace(new RegExp(`\\{${key}\\}`, "g"), value);
  }

  return result;
}

/**
 * Creates a new note file from a template
 */
export async function createNoteFromTemplate(
  templateType: string,
  directoryName: string,
  filenamePrefix: string = "",
  customVars: Record<string, string> = {},
  isPrivate: boolean = false,
  customTemplateContent?: string
): Promise<void> {
  const workspaceRoot = await getWorkspaceRoot();
  if (!workspaceRoot) return;

  // Get template content, either from parameter or by reading template file
  let templateContent: string | undefined;

  if (customTemplateContent) {
    templateContent = customTemplateContent;
  } else {
    templateContent = await readTemplate(templateType);
    if (!templateContent) return;
  }

  // Create formatted content
  const formattedContent = formatTemplate(templateContent, customVars);

  // Determine the base directory based on privacy setting
  const baseDir = isPrivate ? `/private/${directoryName}` : directoryName;

  // First check if the project is using the Neurd structure
  let contentDir = path.join(workspaceRoot, "content", baseDir);

  // If the content directory doesn't exist yet, create it
  if (!fs.existsSync(path.join(workspaceRoot, "content"))) {
    // Check if we should create the Neurd structure or just use root folders
    const createNeurdStructure = await vscode.window.showQuickPick(
      ["Yes, use Neurd structure", "No, use project root"],
      { placeHolder: "Create Neurd content folder structure?" }
    );

    if (!createNeurdStructure) {
      return; // User cancelled
    }

    if (createNeurdStructure === "No, use project root") {
      // Use directories directly at workspace root
      contentDir = path.join(workspaceRoot, baseDir);
    }
  }

  // Ensure directory exists
  ensureDirectoryExists(contentDir);

  // Generate filename
  const now = new Date();
  const dateStr = now.toISOString().split("T")[0]; // YYYY-MM-DD
  const filename = filenamePrefix
    ? `${filenamePrefix}-${dateStr}.md`
    : `${dateStr}.md`;

  const filePath = path.join(contentDir, filename);

  // Check if file already exists
  if (fs.existsSync(filePath)) {
    const overwrite = await vscode.window.showWarningMessage(
      `File ${filename} already exists. Do you want to overwrite it?`,
      "Yes",
      "No"
    );

    if (overwrite !== "Yes") {
      return;
    }
  }

  // Write the file
  fs.writeFileSync(filePath, formattedContent);

  // Open the file in the editor
  const document = await vscode.workspace.openTextDocument(filePath);
  await vscode.window.showTextDocument(document);

  vscode.window.showInformationMessage(
    `Created new ${templateType} note: ${filename}`
  );
}
