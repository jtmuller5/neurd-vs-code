import * as vscode from 'vscode';
import { createDailyNote } from './createDailyNote';
import { createWeeklyNote } from './createWeeklyNote';
import { createNote } from './createNote';

export function registerCommands(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand('neurd.createDailyNote', createDailyNote),
    vscode.commands.registerCommand('neurd.createWeeklyNote', createWeeklyNote),
    vscode.commands.registerCommand('neurd.createNote', createNote)
  );
}
