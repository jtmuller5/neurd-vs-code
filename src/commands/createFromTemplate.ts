// File: src/commands/createFromTemplate.ts
import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { getWorkspaceRoot, createNoteFromTemplate } from "../utils";

export async function createFromTemplate(): Promise<void> {
  const workspaceRoot = await getWorkspaceRoot();
  if (!workspaceRoot) return;

  // Find all template files
  const templateFiles = findAllTemplates(workspaceRoot);

  if (templateFiles.length === 0) {
    vscode.window.showErrorMessage(
      "No template files found in the workspace. Templates should be .md files in a templates directory."
    );
    return;
  }

  // Format template options for the quick pick
  const templateOptions = templateFiles.map((file) => {
    const { dir, name } = path.parse(file);
    const relativePath = path.relative(workspaceRoot, dir);
    return {
      label: name,
      description: relativePath || "project root",
      filePath: file,
    };
  });

  // Let user pick a template
  const selectedTemplate = await vscode.window.showQuickPick(templateOptions, {
    placeHolder: "Select a template",
  });

  if (!selectedTemplate) {
    return; // User cancelled
  }

  // Ask for output directory
  const defaultDirectory = "notes";
  const outputDir = await vscode.window.showInputBox({
    placeHolder: "Enter output directory (relative to content/)",
    prompt: "Where should the note be saved?",
    value: defaultDirectory,
  });

  if (!outputDir) {
    return; // User cancelled
  }

  // Ask for a title/filename prefix
  const title = await vscode.window.showInputBox({
    placeHolder: "Enter a title for your note",
    prompt: "This will be used as the filename prefix",
  });

  if (!title) {
    return; // User cancelled
  }

  // Convert title to filename-friendly format
  const filenamePrefix = title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  // Ask if this should be a private note
  const privacyOptions = ["Public", "Private"];
  const selectedPrivacy = await vscode.window.showQuickPick(privacyOptions, {
    placeHolder: "Choose visibility (Private notes are not committed to Git)",
  });

  if (!selectedPrivacy) {
    return; // User cancelled
  }

  const isPrivate = selectedPrivacy === "Private";

  // Read the template content
  try {
    const templateContent = fs.readFileSync(selectedTemplate.filePath, "utf8");

    // Create the note from the template
    createNoteFromCustomTemplate(
      templateContent,
      outputDir,
      filenamePrefix,
      { title },
      isPrivate
    );
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to read template: ${error}`);
  }
}

/**
 * Creates a note from custom template content
 */
async function createNoteFromCustomTemplate(
  templateContent: string,
  directoryName: string,
  filenamePrefix: string,
  customVars: Record<string, string>,
  isPrivate: boolean
): Promise<void> {
  const workspaceRoot = getWorkspaceRoot();
  if (!workspaceRoot) return;

  // Use the createNoteFromTemplate function, but with the template content directly
  await createNoteFromTemplate(
    "", // Not used when template content is provided directly
    directoryName,
    filenamePrefix,
    customVars,
    isPrivate,
    templateContent // Pass the template content directly
  );
}

/**
 * Find all template files in the workspace
 */
function findAllTemplates(workspaceRoot: string): string[] {
  const templateFiles: string[] = [];
  const possibleTemplateDirs = [
    path.join(workspaceRoot, "templates"),
    path.join(workspaceRoot, ".templates"),
    path.join(workspaceRoot, ".vscode"),
  ];

  // Also look for .md files in the root
  const rootMdFiles = findMarkdownFiles(workspaceRoot);
  templateFiles.push(...rootMdFiles);

  // Look in template directories
  for (const dir of possibleTemplateDirs) {
    if (fs.existsSync(dir)) {
      const files = findMarkdownFiles(dir);
      templateFiles.push(...files);
    }
  }

  return templateFiles;
}

/**
 * Find all markdown files in a directory (non-recursive)
 */
function findMarkdownFiles(directory: string): string[] {
  try {
    return fs
      .readdirSync(directory)
      .filter((file) => file.endsWith(".md"))
      .map((file) => path.join(directory, file));
  } catch (error) {
    return [];
  }
}
