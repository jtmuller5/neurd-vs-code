"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWeeklyNote = void 0;
const vscode = require("vscode");
const utils_1 = require("../utils");
async function createWeeklyNote() {
    // Get the week number
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil(days / 7);
    // Ask if this should be a private note
    const options = ['Public', 'Private'];
    const selectedOption = await vscode.window.showQuickPick(options, {
        placeHolder: 'Choose visibility (Private notes are not committed to Git)'
    });
    // If user cancelled, return
    if (!selectedOption) {
        return;
    }
    const isPrivate = selectedOption === 'Private';
    await (0, utils_1.createNoteFromTemplate)('weekly', 'weekly', `week-${weekNumber}`, {}, isPrivate);
}
exports.createWeeklyNote = createWeeklyNote;
//# sourceMappingURL=createWeeklyNote.js.map