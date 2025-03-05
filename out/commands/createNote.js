"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNote = void 0;
const vscode = require("vscode");
const utils_1 = require("../utils");
async function createNote() {
    // Ask the user for a title
    const title = await vscode.window.showInputBox({
        placeHolder: 'Enter a title for your note',
        prompt: 'This will be used as the filename prefix'
    });
    if (!title) {
        return; // User cancelled
    }
    // Convert title to filename-friendly format
    const filenamePrefix = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    await (0, utils_1.createNoteFromTemplate)('note', 'notes', filenamePrefix, { title });
}
exports.createNote = createNote;
//# sourceMappingURL=createNote.js.map