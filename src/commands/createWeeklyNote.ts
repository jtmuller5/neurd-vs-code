import * as vscode from 'vscode';
import { createNoteFromTemplate } from '../utils';

export async function createWeeklyNote(): Promise<void> {
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
  await createNoteFromTemplate('weekly', 'weekly', `week-${weekNumber}`, {}, isPrivate);
}
