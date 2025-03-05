import * as vscode from 'vscode';
import { registerCommands } from './commands';

export function activate(context: vscode.ExtensionContext) {
  console.log('Neurd Notes extension is now active!');
  
  // Register all commands
  registerCommands(context);
}

export function deactivate() {}