import DemoPage from "@/components/DemoPage";
import BookList from "@/components/BookList";
import { getBooks } from "@/lib/db";
import { likeOnly } from "@/lib/db-actions";

export const metadata = { title: "DB — the static trap" };

// THE TRAP. Nothing here tells Next this page is dynamic: no cookies, no
// headers, no searchParams, no fetch. And node:sqlite is synchronous, so the
// query finishes during the build. Next sees a static page and freezes it,
// with the likes the database had at build time.
export default function StaticTrapPage() {
  const books = getBooks();
  console.log("[Server Component] /db/static-trap — read SQLite");

  return (
    <DemoPage title="The static trap" build="○ (Static) — surprise!" pagesRouter="getStaticProps" section="db">
      <div className="note">
        <p>
          This page reads a database but is <strong>static</strong>. Press{" "}
          <em>+1 like</em>, then reload: the number does not move, although the
          database changed. Open <code>/db/connection</code> to see the real value.
        </p>
        <p>
          In <code>npm run dev</code> it looks fine, because dev renders every
          page on every request. Only <code>npm run prod</code> shows the bug.
          The fix is one line: <code>await connection()</code> (see the next
          pages).
        </p>
      </div>

      <div className="box server">
        <BookList books={books} action={likeOnly} />
      </div>
    </DemoPage>
  );
}
