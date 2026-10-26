import Link from "next/link";
import DemoPage from "@/components/DemoPage";

export const metadata = { title: "Static — generateStaticParams" };

// Tells Next which ids to build at `npm run build`. Here: 1, 2 and 3.
// Any other id (dynamicParams is true by default) is built the FIRST time
// someone asks for it, then cached like the others.
export function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}

export default async function PostPage({ params }) {
  const { id } = await params;
  console.log(`[Server Component] /static/posts/${id} — rendering`);

  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  const post = res.ok ? await res.json() : null;

  return (
    <DemoPage title={`generateStaticParams: /static/posts/${id}`} build="● (SSG)" pagesRouter="getStaticPaths + fallback: 'blocking'" section="static">
      <div className="note">
        <p>
          Posts <Link href="/static/posts/1">1</Link> ·{" "}
          <Link href="/static/posts/2">2</Link> ·{" "}
          <Link href="/static/posts/3">3</Link> were built at{" "}
          <code>npm run build</code>. Post <Link href="/static/posts/4">4</Link> ·{" "}
          <Link href="/static/posts/5">5</Link> were not: the first visit builds
          them (watch the terminal), and from then on they are static too.
        </p>
        <p>
          Compare with <code>/server/params/[id]</code>, which has no{" "}
          <code>generateStaticParams</code>.
        </p>
      </div>

      <div className="box server">
        <p className="stamp">Rendered at: {new Date().toISOString()}</p>
        <p>
          {post ? <strong>{post.title}</strong> : <>No post with id {id}.</>}
        </p>
      </div>
    </DemoPage>
  );
}
