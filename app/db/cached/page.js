import { unstable_cache } from "next/cache";
import DemoPage from "@/components/DemoPage";
import BookList from "@/components/BookList";
import { getBooks } from "@/lib/db";
import { likeAndExpireTag } from "@/lib/db-actions";

export const metadata = { title: "DB — cache with a tag" };

// unstable_cache stores the result of ANY async function (fetch is cached
// automatically; a database query is not). It takes three arguments:
//   1. the async function to cache (here, the SQLite query);
//   2. the cache key: it identifies the entry. If the function depended on
//      arguments, they would go here so each combination gets its own entry;
//   3. options: `tags` are handles to expire the entry from somewhere else.
//      They are separate from the key, even though both are "books" here.
// The result is a function used just like getBooks():
//   - first call: runs the query and stores the result;
//   - next calls: return the stored result, the database is not touched;
//   - after the entry expires: the next call runs the query again.
// The Server Action calls updateTag('books') after writing, which expires every
// entry with that tag. The price: you must expire the tag everywhere the data
// is written, or the page will keep showing old data.
// Note: after a like, the action's response carries the fresh page, but a plain
// reload can still return the copy prerendered at build time (0 likes) for a
// while (10 to 40 seconds in tests) until the cache catches up. This is default
// Next.js behavior, not something configured here.
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
