import * as vscode from 'vscode';
import { createNoteFromTemplate } from '../utils';

export async function createNote(): Promise<void> {
  // Ask the user for a title
  const title = await vscode.window.showInputBox({
    placeHolder: 'Enter a title for your note',
    prompt: 'This will be used as the filename prefix'
  });
  
  if (!title) {
    return; // User cancelled
  }
  
  // Convert title to filename-friendly format
  const filenamePrefix = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  await createNoteFromTemplate('note', 'notes', filenamePrefix, { title });
}