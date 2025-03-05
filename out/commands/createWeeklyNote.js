"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWeeklyNote = void 0;
const utils_1 = require("../utils");
async function createWeeklyNote() {
    // Get the week number
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil(days / 7);
    await (0, utils_1.createNoteFromTemplate)("weekly", "weekly", `week-${weekNumber}`);
}
exports.createWeeklyNote = createWeeklyNote;
//# sourceMappingURL=createWeeklyNote.js.map