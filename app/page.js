import Link from "next/link";

export default function Home() {
  return (
    <main className="container">
      <h1>Server Components, Client Components and Server Actions</h1>
      <p className="lead">
        Five pages, one idea each. Every component logs to the place where it
        runs: the terminal for the server, the browser console for the client.
        Keep <strong>both</strong> visible while you click around.
      </p>

      <p>
        Each demo wraps its components in a labelled box:{" "}
        <span className="tag server">Server Component</span> or{" "}
        <span className="tag client">Client Component</span>. Boxes can nest.
      </p>

      <h2>
        <Link href="/server">/server</Link> — Server Component
      </h2>
      <p>
        The default. The component is an <code>async</code> function that
        fetches its own data, so there is no <code>getServerSideProps</code>,
        no <code>useEffect</code> and no loading state. It can use Node.js
        modules, and none of its code is sent to the browser.
      </p>

      <h2>
        <Link href="/static">/static</Link> — Static page
      </h2>
      <p>
        The same Server Component without <code>searchParams</code>. It reads
        no request data, so Next renders it once at build time, like{" "}
        <code>getStaticProps</code>. Compare it with <code>/server</code> after{" "}
        <code>npm run build</code>.
      </p>

      <h2>
        <Link href="/client">/client</Link> — Client Component
      </h2>
      <p>
        Add <code>&quot;use client&quot;</code> to a file and it can use state,
        effects, event handlers and browser APIs. The page around it stays a
        Server Component.
      </p>

      <h2>
        <Link href="/composition">/composition</Link> — Server + Client together
      </h2>
      <p>
        How the two mix: a Server Component passes data to a Client Component
        through props, and a Client Component can show a Server Component that
        it receives as <code>children</code>.
      </p>

      <h2>
        <Link href="/actions">/actions</Link> — Server Actions
      </h2>
      <p>
        Functions marked <code>&quot;use server&quot;</code> that run on the
        server but are called straight from a form. Add and delete notes
        without writing an API route.
      </p>

      <div className="note" style={{ marginTop: "2.5rem" }}>
        <p>
          <strong>Important:</strong> in <code>npm run dev</code> every page is
          rendered on every request, which hides the difference between static
          and dynamic pages. To see the real behaviour, run{" "}
          <code>npm run build &amp;&amp; npm start</code>.
        </p>
      </div>
    </main>
  );
}
