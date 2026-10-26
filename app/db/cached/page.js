import { unstable_cache } from "next/cache";
import DemoPage from "@/components/DemoPage";
import BookList from "@/components/BookList";
import { getBooks } from "@/lib/db";
import { likeAndExpireTag } from "@/lib/db-actions";

export const metadata = { title: "DB — cache with a tag" };

// unstable_cache stores the result of ANY async function (fetch is cached
// automatically; a database query is not). The tag 'books' is a handle: the
// Server Action calls updateTag('books') and this entry is thrown away.
const getCachedBooks = unstable_cache(async () => getBooks(), ["books"], {
  tags: ["books"],
});

export default async function CachedPage() {
  const books = await getCachedBooks();
  console.log("[Server Component] /db/cached — rendering");

  return (
    <DemoPage title="unstable_cache + tag" build="○ (Static)" pagesRouter="getStaticProps + res.revalidate()" section="db">
      <div className="note">
        <p>
          A static page with no timer. Press <em>+1 like</em>: the Server Action
          writes to SQLite and then calls <code>{"updateTag(\"books\")"}</code>, so
          the cache entry expires and the new number shows at once (the response
          of the action carries the fresh page). A plain reload right after can
          still return the old copy for a while. Without a like, the page and its
          query do not run again.
        </p>
        <p>
          Best of both: static speed, and fresh data exactly when it changes. The
          price: you must remember to expire the tag everywhere the data is written.
        </p>
      </div>

      <div className="box server">
        <BookList books={books} action={likeAndExpireTag} />
      </div>
    </DemoPage>
  );
}
