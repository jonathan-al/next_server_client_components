import { connection } from "next/server";
import DemoPage from "@/components/DemoPage";
import BookList from "@/components/BookList";
import { getBooks } from "@/lib/db";
import { likeAndRevalidatePath } from "@/lib/db-actions";

export const metadata = { title: "DB — revalidatePath" };

// A dynamic page: nothing is cached, so the data is always right on a reload.
// What this page adds is the screen the user already has open. A Server Action
// that writes and invalidates nothing leaves that screen with the old number.
// Calling revalidatePath('/db/revalidate-path') at the end of the action makes
// Next send the fresh render in the action's response.
export default async function RevalidatePathPage() {
  await connection();

  const books = getBooks();
  console.log("[Server Component] /db/revalidate-path — read SQLite");

  return (
    <DemoPage title="Dynamic page + revalidatePath" build="ƒ (Dynamic)" pagesRouter="getServerSideProps" section="db">
      <div className="note">
        <p>
          Same page as <code>/db/connection</code>, but the action ends with{" "}
          <code>{"revalidatePath(\"/db/revalidate-path\")"}</code>. Press{" "}
          <em>+1 like</em>: the number changes at once. On{" "}
          <code>/db/connection</code> the action writes and invalidates nothing,
          so the screen keeps the old number until you reload.
        </p>
        <p>
          There is no cache and no tag here: the call only says &quot;refresh the
          page the user is looking at&quot;. This is what you want after a write
          on data that must never be stale, such as a bank balance.
        </p>
      </div>

      <div className="box server">
        <BookList books={books} action={likeAndRevalidatePath} />
      </div>
    </DemoPage>
  );
}
