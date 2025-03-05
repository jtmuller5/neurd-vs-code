import * as vscode from 'vscode';
import { createDailyNote } from './createDailyNote';
import { createWeeklyNote } from './createWeeklyNote';
import { createNote } from './createNote';
import { createFromTemplate } from './createFromTemplate';
import { setDefaultJournalCommand } from '../settings';

export function registerCommands(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand('neurd.createDailyNote', createDailyNote),
    vscode.commands.registerCommand('neurd.createWeeklyNote', createWeeklyNote),
    vscode.commands.registerCommand('neurd.createNote', createNote),
    vscode.commands.registerCommand('neurd.createFromTemplate', createFromTemplate),
    vscode.commands.registerCommand('neurd.setDefaultJournal', setDefaultJournalCommand)
  );
}