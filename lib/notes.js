// A JSON file stands in for a database, so you can open data/notes.json and
// watch it change. Only the server can touch the file system.
//
// `server-only` makes the build fail if a Client Component ever imports this
// module, directly or through another file.
import "server-only";
import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

const NOTES_FILE = path.join(process.cwd(), "data", "notes.json");

export async function getNotes() {
  const raw = await fs.readFile(NOTES_FILE, "utf8");
  return JSON.parse(raw);
}

async function saveNotes(notes) {
  await fs.writeFile(NOTES_FILE, JSON.stringify(notes, null, 2) + "\n");
}

export async function addNote(text) {
  const notes = await getNotes();
  const note = { id: randomUUID(), text, createdAt: new Date().toISOString() };
  await saveNotes([...notes, note]);
}

export async function removeNote(id) {
  const notes = await getNotes();
  await saveNotes(notes.filter((note) => note.id !== id));
}
