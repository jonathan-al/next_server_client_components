"use server"; // This file is a Server Action. It runs on the server, but can be
// called from a Client Component through a form. See NoteForm.js for an example.

import { revalidatePath } from "next/cache";
import { addNote, removeNote } from "@/lib/notes";

// "use server" at the top turns every export of this file into a Server Action:
// A function that runs on the server but can be called from a form.
//
// Careful: each Server Action is a public POST endpoint, even if only your own
// form calls it. A real app must check authentication and authorization at
// the top of every action.

// Used with useActionState, so the first argument is the previous state and
// the second is the form data. Whatever it returns becomes the new state.
export async function createNote(prevState, formData) {
  console.log("[Server Action] createNote — running");

  const text = String(formData.get("text") ?? "").trim();

  if (text.length < 3) {
    // React clears the form after an action, so send the text back to refill it.
    return { error: "A note needs at least 3 characters.", text };
  }

  // Slow on purpose, so you can see the "Saving…" state.
  await new Promise((resolve) => setTimeout(resolve, 1000));

  await addNote(text);

  // Tells Next the /actions page is out of date: it renders again with the new
  // note, and the fresh result comes back in the same response as the action.
  revalidatePath("/actions");

  return { error: null, text: "" };
}

// Used directly as <form action={deleteNote}>, so it only receives the form data.
export async function deleteNote(formData) {
  const id = String(formData.get("id") ?? "").trim(); // formData.get() can return null
  console.log(`[Server Action] deleteNote — id=${id}`);

  await removeNote(id);
  revalidatePath("/actions");
}
