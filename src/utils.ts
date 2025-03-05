import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

/**
 * Gets the workspace root path
 */
export function getWorkspaceRoot(): string | undefined {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    vscode.window.showErrorMessage("No workspace folder is open");
    return undefined;
  }
  return workspaceFolders[0].uri.fsPath;
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
  const workspaceRoot = getWorkspaceRoot();
  if (!workspaceRoot) return undefined;

  const templatePath = path.join(
    workspaceRoot,
    "templates",
    `${templateType}.md`
  );

  try {
    if (fs.existsSync(templatePath)) {
      return fs.readFileSync(templatePath, "utf8");
    } else {
      // Template doesn't exist, create a default one
      return createDefaultTemplate(templateType);
    }
  } catch (err) {
    vscode.window.showErrorMessage(
      `Failed to read template: ${templateType}.md`
    );
    return undefined;
  }
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
  const formattedDate = now.toISOString().split("T")[0]; // YYYY-MM-DD
  const formattedTime = now.toLocaleTimeString();

  let result = template
    .replace(/\${date}/g, formattedDate)
    .replace(/\${time}/g, formattedTime)
    .replace(/\${datetime}/g, `${formattedDate} ${formattedTime}`);

  // Replace any custom variables
  for (const [key, value] of Object.entries(customVars)) {
    result = result.replace(new RegExp(`\\$\\{${key}\\}`, "g"), value);
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
  isPrivate: boolean = false
): Promise<void> {
  const workspaceRoot = getWorkspaceRoot();
  if (!workspaceRoot) return;

  // Read template content
  const templateContent = await readTemplate(templateType);
  if (!templateContent) return;

  // Create formatted content
  const formattedContent = formatTemplate(templateContent, customVars);

  // Determine the base directory based on privacy setting
  const baseDir = isPrivate ? "private" : directoryName;

  // Ensure directory exists
  const contentDir = path.join(workspaceRoot, "content", baseDir);
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
