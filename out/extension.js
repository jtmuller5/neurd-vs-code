"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const commands_1 = require("./commands");
function activate(context) {
    console.log('Neurd Notes extension is now active!');
    // Register all commands
    (0, commands_1.registerCommands)(context);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map