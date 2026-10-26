import Link from "next/link";

export const metadata = { title: "Static page — rendered at build time" };

// The same Server Component as /server, minus `searchParams`. It uses no
// request-time API (searchParams, cookies(), headers(), connection()), so Next
// prerenders it once, at `npm run build`, and serves that HTML to everyone. The
// same idea as getStaticProps: the fetch below also runs only at build time.
export default async function StaticPage() {
  console.log("[Server Component] /static — rendering");

  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  const users = await res.json();

  return (
    <main className="container">
      <h1>Static page</h1>

      <div className="note">
        <p>
          The same Server Component as <Link href="/server">/server</Link>, but
          it reads no request data, so it is <strong>static</strong>: Next
          renders it once, at build time, like <code>getStaticProps</code> did.
        </p>
        <p>
          You will not see it in <code>npm run dev</code>, which renders every
          page on every request. Run{" "}
          <code>npm run build &amp;&amp; npm start</code> and reload this page:
          the timestamp stays the same and the terminal logs nothing, because
          the page already rendered during the build.
        </p>
      </div>

      <div className="box server">
        <p className="stamp">Rendered at: {new Date().toISOString()}</p>
        <ul className="list">
          {users.slice(0, 5).map((user) => (
            <li className="item" key={user.id}>
              <span className="id">#{user.id}</span>
              {user.name} — {user.email}
            </li>
          ))}
        </ul>
      </div>

      <Link className="back" href="/">
        ← Back home
      </Link>
    </main>
  );
}
