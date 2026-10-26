"use server";

import { updateTag } from "next/cache";
import { likeBook, resetLikes } from "@/lib/db";

// Same database write, different follow-up. What a Server Action does AFTER
// writing decides which cached pages notice the change.

// Only writes. No page is told that anything changed.
export async function likeOnly(formData) {
  const id = Number(formData.get("id"));
  console.log(`[Server Action] likeOnly — book ${id}`);
  likeBook(id);
}

// Writes, then expires the "books" cache tag so /db/cached reads fresh data.
export async function likeAndExpireTag(formData) {
  const id = Number(formData.get("id"));
  console.log(`[Server Action] likeAndExpireTag — book ${id}`);
  likeBook(id);
  updateTag("books");
}

export async function resetAllLikes() {
  console.log("[Server Action] resetAllLikes");
  resetLikes();
  updateTag("books");
}
