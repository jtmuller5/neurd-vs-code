"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDailyNote = void 0;
const utils_1 = require("../utils");
async function createDailyNote() {
    await (0, utils_1.createNoteFromTemplate)('daily', 'daily');
}
exports.createDailyNote = createDailyNote;
//# sourceMappingURL=createDailyNote.js.map