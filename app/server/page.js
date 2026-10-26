import Link from "next/link";
import os from "node:os";

export const metadata = { title: "Server Component — async/await" };

// A Server Component can be an async function: it awaits its own data. No
// getServerSideProps, no useEffect, no loading state — the data is already in
// the HTML when the browser receives it.
//
// Reading `searchParams` is a request-time API, so this page is rendered on
// every request (the same idea as getServerSideProps). Without it the page
// would be static: rendered once at build time.
export default async function ServerPage({ searchParams }) {
  const { limit: limitParam } = await searchParams;
  const limit = Math.min(Math.max(Number(limitParam) || 5, 1), 10);
  console.log(`[Server Component] /server — rendering (limit=${limit})`);

  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  const users = await res.json();

  return (
    <main className="container">
      <h1>Server Component</h1>

      <div className="note">
        <p>
          This page is a <strong>Server Component</strong>, the default in the
          App Router. The component itself is <code>async</code> and awaits its
          data, so there is no <code>getServerSideProps</code>. Open{" "}
          <em>View Page Source</em>: the users are already in the HTML.
        </p>
        <p>
          It reads <code>searchParams</code>, so it runs on every request, like{" "}
          <code>getServerSideProps</code> did. Try{" "}
          <Link href="/server?limit=3">?limit=3</Link> ·{" "}
          <Link href="/server?limit=10">?limit=10</Link> and watch the terminal.
          Without <code>searchParams</code> it would be static: see{" "}
          <Link href="/static">/static</Link>. More ways to be dynamic are on the{" "}
          <Link href="/#server">home page</Link>.
        </p>
      </div>

      <div className="box server">
        <p className="stamp">
          Rendered at: {new Date().toISOString()} · showing {limit} user
          {limit === 1 ? "" : "s"}
        </p>
        <ul className="list">
          {users.slice(0, limit).map((user) => (
            <li className="item" key={user.id}>
              <span className="id">#{user.id}</span>
              {user.name} — {user.email}
            </li>
          ))}
        </ul>
      </div>

      <h2>Things only the server can do</h2>
      <div className="box server">
        <ul className="facts">
          <li>
            Node.js version: <code>{process.version}</code>
          </li>
          <li>
            Platform, from the Node.js <code>os</code> module:{" "}
            <code>{os.platform()}</code>
          </li>
          <li>
            <code>typeof window</code>: <code>{typeof window}</code>
          </li>
        </ul>
      </div>
      <p className="lead">
        The <code>os</code> module does not exist in a browser, and{" "}
        <code>window</code> is undefined here. This code runs only on the
        server, so it is never part of the JavaScript bundle. That is also why
        API keys and database calls are safe in a Server Component.
      </p>

      <Link className="back" href="/">
        ← Back home
      </Link>
    </main>
  );
}
