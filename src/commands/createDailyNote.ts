import * as vscode from "vscode";
import { createNoteFromTemplate } from "../utils";

export async function createDailyNote(): Promise<void> {
  // Ask if this should be a private note
  const options = ["Public", "Private"];
  const selectedOption = await vscode.window.showQuickPick(options, {
    placeHolder: "Choose visibility (Private notes are not committed to Git)",
  });

  // If user cancelled, return
  if (!selectedOption) {
    return;
  }

  const isPrivate = selectedOption === "Private";
  await createNoteFromTemplate("daily", "daily", "", {}, isPrivate);
}
