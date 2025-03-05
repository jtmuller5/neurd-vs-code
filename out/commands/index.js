"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCommands = void 0;
const vscode = require("vscode");
const createDailyNote_1 = require("./createDailyNote");
const createWeeklyNote_1 = require("./createWeeklyNote");
const createNote_1 = require("./createNote");
const createFromTemplate_1 = require("./createFromTemplate");
const settings_1 = require("../settings");
function registerCommands(context) {
    context.subscriptions.push(vscode.commands.registerCommand('neurd.createDailyNote', createDailyNote_1.createDailyNote), vscode.commands.registerCommand('neurd.createWeeklyNote', createWeeklyNote_1.createWeeklyNote), vscode.commands.registerCommand('neurd.createNote', createNote_1.createNote), vscode.commands.registerCommand('neurd.createFromTemplate', createFromTemplate_1.createFromTemplate), vscode.commands.registerCommand('neurd.setDefaultJournal', settings_1.setDefaultJournalCommand));
}
exports.registerCommands = registerCommands;
//# sourceMappingURL=index.js.map