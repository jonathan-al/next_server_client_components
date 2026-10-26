"use client";

import { useActionState } from "react";
import { createNote } from "@/lib/actions";

const initialState = { error: null, text: "" };

// A Client Component can call a Server Action, but cannot define one: it has
// to import it from a file that starts with "use server".
//
// useActionState wraps the action and gives back:
//   state      — whatever the action returned last (or initialState)
//   formAction — pass it to <form action={...}>
//   pending    — true while the action is running on the server
export default function NoteForm() {
  // useActionState is a React hook, so it can only be called at the top level of
  // a Client Component. It cannot be called in a Server Component, because
  // Server Components are not React components and do not run in the browser.
  // "pending" is a flag that means the action is running on the server, so the form is disabled and
  // shows "Saving…". The action returns the new state, which is used to refill the form and show any error.
  const [state, formAction, pending] = useActionState(createNote, initialState);

  return (
    <div className="box client">
      <form action={formAction} className="form">
        <input
          type="text"
          name="text"
          placeholder="Write a note…"
          aria-label="Note text"
          defaultValue={state.text}
        />
        <button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Add note"}
        </button>
        {state.error && (
          <p className="error" role="alert">
            {state.error}
          </p>
        )}
      </form>
    </div>
  );
}
