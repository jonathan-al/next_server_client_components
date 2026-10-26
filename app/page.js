import Link from "next/link";

// The home page is a dictionary of cases: one line per page, grouped by how
// Next.js produces it. The symbol is what `npm run build` prints for the route.
function Case({ href, symbol, pages, children }) {
  return (
    <li>
      <span className="badges">
        {symbol}
        {pages ? ` · ${pages}` : ""}
      </span>
      <Link className="path" href={href}>
        {href}
      </Link>
      <span className="what">{children}</span>
    </li>
  );
}

export default function Home() {
  return (
    <main className="container">
      <h1>Server Components, Client Components and Server Actions</h1>
      <p className="lead">
        A dictionary of how Next.js builds each page. Every component logs to the
        place where it runs: the terminal for the server, the browser console for
        the client. Keep <strong>both</strong> visible while you click around.
      </p>

      <div className="note">
        <p>
          <strong>Important:</strong> in <code>npm run dev</code> every page is
          rendered on every request, which hides the difference between static and
          dynamic pages. Study the cases with{" "}
          <code>npm run prod</code> (build + start) and read the route table:{" "}
          <code>○</code> static, <code>●</code> static with parameters,{" "}
          <code>ƒ</code> rendered on every request.
        </p>
        <p>
          Each demo wraps its components in a labelled box:{" "}
          <span className="tag server">Server Component</span> or{" "}
          <span className="tag client">Client Component</span>.
        </p>
      </div>

      <h2 id="fundamentals">Fundamentals</h2>
      <p>Where does the code run, and what can it do?</p>
      <ul className="index">
        <Case href="/client">
          Add <code>&quot;use client&quot;</code> and a component can use state,
          effects, event handlers and browser APIs. The page around it stays a
          Server Component.
        </Case>
        <Case href="/composition">
          How the two mix: a Server Component passes data to a Client Component
          through props, and a Client Component can show a Server Component it
          receives as <code>children</code>.
        </Case>
        <Case href="/actions" symbol="ƒ">
          Functions marked <code>&quot;use server&quot;</code> that run on the
          server but are called straight from a form. Add and delete notes without
          an API route.
        </Case>
      </ul>

      <h2 id="server">/server — rendered on every request (ƒ)</h2>
      <p>
        An <code>async</code> Server Component that fetches its own data: no{" "}
        <code>getServerSideProps</code>, no <code>useEffect</code>. It becomes
        dynamic as soon as it needs something only a real request knows. These are
        the ways to say so.
      </p>
      <ul className="index">
        <Case href="/server" symbol="ƒ" pages="getServerSideProps">
          <code>searchParams</code>: the page reads <code>?limit=3</code> from the
          URL. Also shows what only the server can do.
        </Case>
        <Case href="/server/cookies" symbol="ƒ" pages="req.cookies">
          <code>cookies()</code>: read the visitor&apos;s cookies, set one from a
          Server Action.
        </Case>
        <Case href="/server/headers" symbol="ƒ" pages="req.headers">
          <code>headers()</code>: user agent and language of the request.
        </Case>
        <Case href="/server/connection" symbol="ƒ">
          <code>connection()</code>: nothing to read, but the output must differ
          every time (random, current time).
        </Case>
        <Case href="/server/no-store" symbol="ƒ" pages="getServerSideProps">
          <code>{"fetch(url, { cache: 'no-store' })"}</code>: fresh data makes the
          page dynamic.
        </Case>
        <Case href="/server/force-dynamic" symbol="ƒ" pages="getServerSideProps">
          <code>{"dynamic = 'force-dynamic'"}</code>: the blunt switch for a whole
          route.
        </Case>
        <Case href="/server/params/1" symbol="ƒ" pages="getServerSideProps">
          Dynamic route <code>[id]</code> without <code>generateStaticParams</code>.
        </Case>
      </ul>

      <h2 id="static">/static — built once (○ and ●)</h2>
      <p>
        No request data, so Next renders the page at build time and serves that
        HTML to everyone, like <code>getStaticProps</code>. These are the ways to
        keep it fresh, or to guarantee it stays static.
      </p>
      <ul className="index">
        <Case href="/static" symbol="○" pages="getStaticProps">
          The default: the same Server Component as <code>/server</code> without{" "}
          <code>searchParams</code>.
        </Case>
        <Case href="/static/force-static" symbol="○" pages="getStaticProps">
          <code>{"dynamic = 'force-static'"}</code>: <code>cookies()</code> and{" "}
          <code>headers()</code> return empty values.
        </Case>
        <Case href="/static/error" symbol="○" pages="getStaticProps">
          <code>{"dynamic = 'error'"}</code>: the build fails if the page would
          become dynamic.
        </Case>
        <Case href="/static/revalidate" symbol="○ 10s" pages="revalidate: 10">
          <code>export const revalidate = 10</code>: ISR for the whole route.
        </Case>
        <Case href="/static/fetch-revalidate" symbol="○ 10s" pages="revalidate: 10">
          <code>{"fetch(url, { next: { revalidate: 10 } })"}</code>: ISR set on one
          fetch.
        </Case>
        <Case href="/static/on-demand" symbol="○" pages="res.revalidate()">
          <code>revalidatePath()</code> from a Server Action: rebuild when you say
          so.
        </Case>
        <Case href="/static/posts/1" symbol="●" pages="getStaticPaths">
          <code>generateStaticParams</code>: ids 1–3 built at build time, others on
          their first visit.
        </Case>
        <Case href="/static/posts-strict/1" symbol="●" pages="fallback: false">
          <code>{"dynamicParams = false"}</code>: any id not listed is a 404.
        </Case>
      </ul>

      <h2 id="db">/db — SQLite: the same data, four behaviours</h2>
      <p>
        A real database (<code>node:sqlite</code>, built into Node.js). All four
        pages show the same books with the same <em>+1 like</em> button. Press it
        on each and see who notices the change.
      </p>
      <ul className="index">
        <Case href="/db/static-trap" symbol="○">
          The trap: a database query does not make a page dynamic, so it freezes at
          build time.
        </Case>
        <Case href="/db/connection" symbol="ƒ" pages="getServerSideProps">
          The fix: <code>await connection()</code> before the query. Always fresh.
        </Case>
        <Case href="/db/revalidate" symbol="○ 10s" pages="revalidate: 10">
          ISR: static, rebuilt in the background every 10 seconds.
        </Case>
        <Case href="/db/cached" symbol="○" pages="res.revalidate()">
          <code>unstable_cache</code> with a tag, expired by the Server Action that
          writes.
        </Case>
      </ul>
    </main>
  );
}
