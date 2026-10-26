import Link from "next/link";
import DemoPage from "@/components/DemoPage";

export const metadata = { title: "Static — dynamicParams = false" };

// Only the ids listed here exist. Anything else is a 404, never built on demand.
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}

export default async function StrictPostPage({ params }) {
  const { id } = await params;
  console.log(`[Server Component] /static/posts-strict/${id} — rendering`);

  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  const post = await res.json();

  return (
    <DemoPage title={`dynamicParams = false: /static/posts-strict/${id}`} build="● (SSG)" pagesRouter="getStaticPaths + fallback: false" section="static">
      <div className="note">
        <p>
          Same as <code>/static/posts/[id]</code>, plus{" "}
          <code>{"export const dynamicParams = false"}</code>. Posts{" "}
          <Link href="/static/posts-strict/1">1</Link> ·{" "}
          <Link href="/static/posts-strict/2">2</Link> ·{" "}
          <Link href="/static/posts-strict/3">3</Link> work. Post{" "}
          <Link href="/static/posts-strict/4">4</Link> is a 404.
        </p>
      </div>

      <div className="box server">
        <p className="stamp">Rendered at: {new Date().toISOString()}</p>
        <p>
          <strong>{post.title}</strong>
        </p>
      </div>
    </DemoPage>
  );
}
