import Link from "next/link";
import { connection } from "next/server";
import NoteForm from "@/components/NoteForm";
import { getNotes } from "@/lib/notes";
import { deleteNote } from "@/lib/actions";

export const metadata = { title: "Server Actions" };

// A Server Component can read the file system directly. Nothing here calls an
// API route: the page reads the data, and the forms call Server Actions.
export default async function ActionsPage() {
  // Reading a file is not a request-time API, so without this line Next would
  // prerender the page once at build time and keep serving that old copy.
  // connection() says "wait for a real request", so the notes are always fresh.
  await connection();

  const notes = await getNotes();
  console.log(`[Server Component] /actions — rendering ${notes.length} notes`);

  return (
    <main className="container">
      <h1>Server Actions</h1>

      <div className="note">
        <p>
          A <strong>Server Action</strong> is an async function marked with{" "}
          <code>&quot;use server&quot;</code>. You pass it to a form&apos;s{" "}
          <code>action</code> prop, and Next sends a POST request to run it on
          the server. There is no API route and no <code>fetch</code>. Open
          DevTools, go to the Network tab and add a note to see the POST.
        </p>
        <p>
          <strong>Add</strong> is a Client Component using{" "}
          <code>useActionState</code> for the pending and error states.{" "}
          <strong>Delete</strong> is a plain form in a Server Component, so it
          needs no Client Component and even works with JavaScript disabled.
          Both end with <code>revalidatePath</code>, which refreshes this page.
          The notes live in <code>data/notes.json</code>.
        </p>
      </div>

      <div className="box server">
        <p className="stamp">Rendered at: {new Date().toISOString()}</p>

        <NoteForm />

        <ul className="list">
          {notes.map((note) => (
            <li className="item row" key={note.id}>
              <span>{note.text}</span>
              <form action={deleteNote}>
                <input type="hidden" name="id" value={note.id} />
                <button className="secondary" type="submit">
                  Delete
                </button>
              </form>
            </li>
          ))}
        </ul>
        {notes.length === 0 && <p className="lead">No notes yet. Add one.</p>}
      </div>

      <Link className="back" href="/">
        ← Back home
      </Link>
    </main>
  );
}
