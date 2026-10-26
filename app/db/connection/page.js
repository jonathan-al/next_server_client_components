import { connection } from "next/server";
import DemoPage from "@/components/DemoPage";
import BookList from "@/components/BookList";
import { getBooks } from "@/lib/db";
import { likeOnly, resetAllLikes } from "@/lib/db-actions";

export const metadata = { title: "DB — connection()" };

// The fix for the trap: wait for a real request before querying. Every visit
// runs the query again, so the page is always right. The price: every visit
// does the work, and nothing is prebuilt.
export default async function ConnectionDbPage() {
  await connection();

  const books = getBooks();
  console.log("[Server Component] /db/connection — read SQLite");

  return (
    <DemoPage title="connection() before the query" build="ƒ (Dynamic)" pagesRouter="getServerSideProps" section="db">
      <div className="note">
        <p>
          Same page and same data as <code>/db/static-trap</code>, with one extra
          line: <code>await connection()</code>. Press <em>+1 like</em>, reload,
          and the new number is there. This is the source of truth the other pages
          are compared with.
        </p>
      </div>

      <div className="box server">
        <BookList books={books} action={likeOnly} />
        <form action={resetAllLikes}>
          <button type="submit">Reset all likes to 0</button>
        </form>
      </div>
    </DemoPage>
  );
}
