import { createNoteFromTemplate } from "../utils";

export async function createWeeklyNote(): Promise<void> {
  // Get the week number
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor(
    (now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)
  );
  const weekNumber = Math.ceil(days / 7);

  await createNoteFromTemplate("weekly", "weekly", `week-${weekNumber}`);
}
