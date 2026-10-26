import Link from "next/link";

// Shared frame for the small demo pages: title, a line saying what the build
// should print for this route, and a link back to its section on the home page.
// It is a Server Component, so none of it is sent to the browser as JavaScript.
const SECTIONS = {
  server: "/server cases",
  static: "/static cases",
  db: "/db cases",
};

export default function DemoPage({ title, build, pagesRouter, section, children }) {
  return (
    <main className="container">
      <h1>{title}</h1>
      <p className="meta">
        <span>
          Build shows: <strong>{build}</strong>
        </span>
        {pagesRouter ? (
          <span>
            Pages Router: <code>{pagesRouter}</code>
          </span>
        ) : null}
      </p>

      {children}

      <Link className="back" href={`/#${section}`}>
        ← Back to {SECTIONS[section]}
      </Link>
    </main>
  );
}
