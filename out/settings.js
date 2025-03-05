"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDefaultJournalCommand = exports.getProjectPath = exports.setDefaultJournalPath = exports.getDefaultJournalPath = void 0;
const vscode = require("vscode");
const fs = require("fs");
// Settings keys
const DEFAULT_JOURNAL_PATH = 'neurd.defaultJournalPath';
/**
 * Gets the default journal path from settings
 */
function getDefaultJournalPath() {
    const config = vscode.workspace.getConfiguration();
    return config.get(DEFAULT_JOURNAL_PATH);
}
exports.getDefaultJournalPath = getDefaultJournalPath;
/**
 * Sets the default journal path in settings
 */
async function setDefaultJournalPath(path) {
    const config = vscode.workspace.getConfiguration();
    await config.update(DEFAULT_JOURNAL_PATH, path, vscode.ConfigurationTarget.Global);
    vscode.window.showInformationMessage(`Default Neurd journal path set to: ${path}`);
}
exports.setDefaultJournalPath = setDefaultJournalPath;
/**
 * Determines the project path to use for note creation
 * - Uses the default journal path if set
 * - Otherwise uses the current workspace
 * - If using current workspace for the first time, sets it as default
 */
async function getProjectPath() {
    // Check if default path is set
    const defaultPath = getDefaultJournalPath();
    // If default path is set and valid, use it
    if (defaultPath && fs.existsSync(defaultPath)) {
        return defaultPath;
    }
    // Otherwise use current workspace
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        vscode.window.showErrorMessage('No workspace folder is open and no default journal location is set');
        return undefined;
    }
    const currentWorkspacePath = workspaceFolders[0].uri.fsPath;
    // If this is the first time using the extension, ask user if they want to set the current workspace as default
    if (!defaultPath) {
        const shouldSetDefault = await vscode.window.showInformationMessage('Would you like to set the current workspace as your default Neurd journal?', 'Yes', 'No, just use it this time');
        if (shouldSetDefault === 'Yes') {
            await setDefaultJournalPath(currentWorkspacePath);
        }
    }
    return currentWorkspacePath;
}
exports.getProjectPath = getProjectPath;
/**
 * Command to set the default journal path
 */
async function setDefaultJournalCommand() {
    // Get current workspace folders
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        vscode.window.showErrorMessage('No workspace folder is open');
        return;
    }
    // Create quick pick items for each open workspace folder
    const folderOptions = workspaceFolders.map(folder => ({
        label: folder.name,
        description: folder.uri.fsPath,
        path: folder.uri.fsPath
    }));
    // Add option to browse for a folder
    folderOptions.push({
        label: 'Browse...',
        description: 'Select a folder not in the current workspace',
        path: ''
    });
    // Let user select from options
    const selected = await vscode.window.showQuickPick(folderOptions, {
        placeHolder: 'Select default Neurd journal location'
    });
    if (!selected) {
        return; // User cancelled
    }
    // If user chose Browse, show folder dialog
    if (selected.label === 'Browse...') {
        const uris = await vscode.window.showOpenDialog({
            canSelectFiles: false,
            canSelectFolders: true,
            canSelectMany: false,
            title: 'Select Default Neurd Journal Location'
        });
        if (!uris || uris.length === 0) {
            return; // User cancelled
        }
        await setDefaultJournalPath(uris[0].fsPath);
    }
    else {
        // User selected a workspace folder
        await setDefaultJournalPath(selected.path);
    }
}
exports.setDefaultJournalCommand = setDefaultJournalCommand;
//# sourceMappingURL=settings.js.map