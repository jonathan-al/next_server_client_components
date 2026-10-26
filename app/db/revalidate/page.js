import DemoPage from "@/components/DemoPage";
import BookList from "@/components/BookList";
import { getBooks } from "@/lib/db";
import { likeOnly } from "@/lib/db-actions";

export const metadata = { title: "DB — revalidate" };

// Static, but rebuilt in the background at most every 10 seconds (ISR). The
// data is never more than about 10 seconds old, and most visits cost nothing.
export const revalidate = 10;

export default function RevalidateDbPage() {
  const books = getBooks();
  console.log("[Server Component] /db/revalidate — read SQLite");

  return (
    <DemoPage title="revalidate = 10" build="○ (Static), revalidate 10s" pagesRouter="getStaticProps + revalidate: 10" section="db">
      <div className="note">
        <p>
          Press <em>+1 like</em> and reload: still the old number. Wait 10 seconds
          and reload: still old, but a rebuild starts in the background (watch
          the terminal). Reload again: the new number.
        </p>
        <p>
          Good when the data may be a little old, like a view counter. Bad for a
          bank balance.
        </p>
      </div>

      <div className="box server">
        <BookList books={books} action={likeOnly} />
      </div>
    </DemoPage>
  );
}
