import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "Server and Client Components demo",
  description:
    "A small demo of Server Components, Client Components and Server Actions in the Next.js App Router.",
};

// Layouts and pages are Server Components by default — no directive needed.
// This file never ships as JavaScript to the browser, only its HTML output does.
//
// suppressHydrationWarning on <body>: browser extensions (Grammarly, Video Speed
// Controller…) add attributes to <body> before React hydrates, and React would
// warn about it in dev. It only silences this one element, not its children.
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <nav className="nav">
          <div className="nav-inner">
            <Link href="/">Home</Link>
            <Link href="/#server">/server — dynamic</Link>
            <Link href="/#static">/static — static</Link>
            <Link href="/#db">/db — SQLite</Link>
            <Link href="/#fundamentals">Fundamentals</Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
