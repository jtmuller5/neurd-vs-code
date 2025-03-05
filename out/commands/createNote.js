"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNote = void 0;
const vscode = require("vscode");
const utils_1 = require("../utils");
async function createNote() {
    // Ask the user for a title
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
    const options = ["Public", "Private"];
    const selectedOption = await vscode.window.showQuickPick(options, {
        placeHolder: "Choose visibility (Private notes are not committed to Git)",
    });
    // If user cancelled, return
    if (!selectedOption) {
        return;
    }
    const isPrivate = selectedOption === "Private";
    await (0, utils_1.createNoteFromTemplate)("note", "notes", filenamePrefix, { title }, isPrivate);
}
exports.createNote = createNote;
//# sourceMappingURL=createNote.js.map