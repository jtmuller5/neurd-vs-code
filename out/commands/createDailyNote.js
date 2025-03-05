"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDailyNote = void 0;
const vscode = require("vscode");
const utils_1 = require("../utils");
async function createDailyNote() {
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
    await (0, utils_1.createNoteFromTemplate)("daily", "daily", "", {}, isPrivate);
}
exports.createDailyNote = createDailyNote;
//# sourceMappingURL=createDailyNote.js.map