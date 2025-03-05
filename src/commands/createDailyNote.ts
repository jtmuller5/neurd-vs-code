import { createNoteFromTemplate } from '../utils';

export async function createDailyNote(): Promise<void> {
  await createNoteFromTemplate('daily', 'daily');
}