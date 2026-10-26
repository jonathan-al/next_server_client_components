import Link from "next/link";
import Counter from "@/components/Counter";
import BrowserInfo from "@/components/BrowserInfo";

export const metadata = { title: "Client Component — state and effects" };

// The page itself stays a Server Component. Only the two small interactive
// pieces are Client Components. Put "use client" on the leaves, not on the
// whole page, so the rest of the page sends no JavaScript.
export default function ClientPage() {
  console.log("[Server Component] /client — rendering the page");

  return (
    <main className="container">
      <h1>Client Component</h1>

      <div className="note">
        <p>
          Use a <strong>Client Component</strong> when you need state, event
          handlers, effects or browser APIs. Mark the file with{" "}
          <code>&quot;use client&quot;</code> at the very top.
        </p>
        <p>
          Click the counter: only the orange box re-renders, in the browser,
          with no request to the server. The green timestamp does not change.
          Then reload the page and watch where the logs appear.
        </p>
      </div>

      <div className="box server">
        <p className="stamp">Server part rendered at: {new Date().toISOString()}</p>
        <Counter />
        <BrowserInfo />
      </div>

      <Link className="back" href="/">
        ← Back home
      </Link>
    </main>
  );
}
