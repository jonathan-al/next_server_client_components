import Link from "next/link";
import PostFilter from "@/components/PostFilter";
import Collapsible from "@/components/Collapsible";
import Comments from "@/components/Comments";

export const metadata = { title: "Server + Client Components together" };

// This page is a Server Component. It fetches the posts and hands them to a
// Client Component through props.
export default async function CompositionPage() {
  console.log("[Server Component] /composition — rendering");

  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
  const posts = await res.json();
  const topTenPosts = posts.slice(0, 10);

  return (
    <main className="container">
      <h1>Server + Client Components together</h1>

      <div className="note">
        <p>
          Real pages mix both kinds. Three rules at the boundary:
        </p>
        <p>
          1. <code>&quot;use client&quot;</code> marks a boundary: that file and
          everything it imports becomes client code.
          <br />
          2. A Client Component cannot import a Server Component, because it
          would turn into client code. Pass it in as <code>children</code>{" "}
          instead.
          <br />
          3. Props going from server to client must be serializable: plain data,
          no functions.
        </p>
      </div>

      <h2>1. Server to Client: data through props</h2>
      <p>
        The green page fetched 10 posts and passed them to the orange filter.
        Typing filters the list in the browser, with no new request.
      </p>
      <div className="box server">
        <PostFilter posts={topTenPosts} />
      </div>

      <h2>2. Client around Server: a Server Component as children</h2>
      <p>
        <code>Collapsible</code> is a Client Component, but the green{" "}
        <code>Comments</code> inside it is a Server Component that fetched its
        own data. Toggle it a few times: only <code>Collapsible</code> logs, in
        the browser. <code>Comments</code> never runs again. View the page
        source: the comments are in the HTML even while collapsed.
      </p>
      <div className="box server">
          {topTenPosts.map(post => (
            <Collapsible key={post.id} title={`comments for posts #${post.id}`}>
              <Comments key={post.id} postId={post.id} />
            </Collapsible>
          ))}
      </div>

      <Link className="back" href="/">
        ← Back home
      </Link>
    </main>
  );
}
