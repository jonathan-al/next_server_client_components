import Link from "next/link";
import DemoPage from "@/components/DemoPage";

export const metadata = { title: "Server — dynamic route" };

// A dynamic route ([id]) WITHOUT generateStaticParams: Next does not know any
// id ahead of time, so nothing can be built at `npm run build`. Compare with
// /static/posts/[id], which lists its ids and gets them prerendered.
export default async function ParamsPage({ params }) {
  const { id } = await params;
  console.log(`[Server Component] /server/params/${id} — rendering`);

  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  const user = res.ok ? await res.json() : null;

  return (
    <DemoPage title={`Dynamic route: /server/params/${id}`} build="ƒ (Dynamic)" pagesRouter="getServerSideProps + params" section="server">
      <div className="note">
        <p>
          <code>[id]</code> in the folder name is a dynamic segment. Without{" "}
          <code>generateStaticParams</code> Next cannot guess the ids, so the page
          renders when someone asks for it.
        </p>
        <p>
          Try{" "}
          <Link href="/server/params/1">1</Link> ·{" "}
          <Link href="/server/params/2">2</Link> ·{" "}
          <Link href="/server/params/3">3</Link> and watch the terminal.
        </p>
      </div>

      <div className="box server">
        <p className="stamp">Rendered at: {new Date().toISOString()}</p>
        <p>
          {user ? (
            <>
              User #{user.id}: <strong>{user.name}</strong> — {user.email}
            </>
          ) : (
            <>No user with id {id}.</>
          )}
        </p>
      </div>
    </DemoPage>
  );
}
