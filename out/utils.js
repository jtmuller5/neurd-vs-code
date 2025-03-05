"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNoteFromTemplate = exports.formatTemplate = exports.readTemplate = exports.ensureDirectoryExists = exports.getWorkspaceRoot = void 0;
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
/**
 * Gets the workspace root path
 */
function getWorkspaceRoot() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        vscode.window.showErrorMessage('No workspace folder is open');
        return undefined;
    }
    return workspaceFolders[0].uri.fsPath;
}
exports.getWorkspaceRoot = getWorkspaceRoot;
/**
 * Creates directory if it doesn't exist
 */
function ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}
exports.ensureDirectoryExists = ensureDirectoryExists;
/**
 * Reads a template file and returns its content
 */
async function readTemplate(templateType) {
    const workspaceRoot = getWorkspaceRoot();
    if (!workspaceRoot)
        return undefined;
    const templatePath = path.join(workspaceRoot, 'templates', `${templateType}.md`);
    try {
        if (fs.existsSync(templatePath)) {
            return fs.readFileSync(templatePath, 'utf8');
        }
        else {
            // Template doesn't exist, create a default one
            return createDefaultTemplate(templateType);
        }
    }
    catch (err) {
        vscode.window.showErrorMessage(`Failed to read template: ${templateType}.md`);
        return undefined;
    }
}
exports.readTemplate = readTemplate;
/**
 * Creates a default template if none exists
 */
function createDefaultTemplate(templateType) {
    switch (templateType) {
        case 'daily':
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
        case 'weekly':
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
        case 'note':
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
function formatTemplate(template, customVars = {}) {
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const formattedTime = now.toLocaleTimeString();
    let result = template
        .replace(/\${date}/g, formattedDate)
        .replace(/\${time}/g, formattedTime)
        .replace(/\${datetime}/g, `${formattedDate} ${formattedTime}`);
    // Replace any custom variables
    for (const [key, value] of Object.entries(customVars)) {
        result = result.replace(new RegExp(`\\$\\{${key}\\}`, 'g'), value);
    }
    return result;
}
exports.formatTemplate = formatTemplate;
/**
 * Creates a new note file from a template
 */
async function createNoteFromTemplate(templateType, directoryName, filenamePrefix = '', customVars = {}) {
    const workspaceRoot = getWorkspaceRoot();
    if (!workspaceRoot)
        return;
    // Read template content
    const templateContent = await readTemplate(templateType);
    if (!templateContent)
        return;
    // Create formatted content
    const formattedContent = formatTemplate(templateContent, customVars);
    // Ensure directory exists
    const contentDir = path.join(workspaceRoot, 'content', directoryName);
    ensureDirectoryExists(contentDir);
    // Generate filename
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const filename = filenamePrefix ?
        `${filenamePrefix}-${dateStr}.md` :
        `${dateStr}.md`;
    const filePath = path.join(contentDir, filename);
    // Check if file already exists
    if (fs.existsSync(filePath)) {
        const overwrite = await vscode.window.showWarningMessage(`File ${filename} already exists. Do you want to overwrite it?`, 'Yes', 'No');
        if (overwrite !== 'Yes') {
            return;
        }
    }
    // Write the file
    fs.writeFileSync(filePath, formattedContent);
    // Open the file in the editor
    const document = await vscode.workspace.openTextDocument(filePath);
    await vscode.window.showTextDocument(document);
    vscode.window.showInformationMessage(`Created new ${templateType} note: ${filename}`);
}
exports.createNoteFromTemplate = createNoteFromTemplate;
//# sourceMappingURL=utils.js.map