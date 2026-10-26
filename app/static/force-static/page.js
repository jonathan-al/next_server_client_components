import { cookies, headers } from "next/headers";
import DemoPage from "@/components/DemoPage";

export const metadata = { title: "Static — force-static" };

// Normally cookies() and headers() would make this page dynamic. force-static
// overrides that: Next builds the page once and hands these functions EMPTY
// values, so the page can no longer depend on the visitor.
export const dynamic = "force-static";

export default async function ForceStaticPage() {
  const userAgent = (await headers()).get("user-agent");
  const theme = (await cookies()).get("theme");
  console.log("[Server Component] /static/force-static — rendering");

  return (
    <DemoPage title="dynamic = 'force-static'" build="○ (Static)" pagesRouter="getStaticProps" section="static">
      <div className="note">
        <p>
          This page calls <code>headers()</code> and <code>cookies()</code>, which
          are request-time APIs and would make it dynamic (compare{" "}
          <code>/server/headers</code>). <code>force-static</code> wins: the page
          is built once and both calls return empty values.
        </p>
        <p>
          Open it with a <code>theme</code> cookie set (see{" "}
          <code>/server/cookies</code>): this page still shows nothing, because it
          never sees your request.
        </p>
      </div>

      <div className="box server">
        <p className="stamp">Rendered at: {new Date().toISOString()}</p>
        <ul className="facts">
          <li>
            <code>user-agent</code>: {String(userAgent)}
          </li>
          <li>
            <code>theme</code> cookie: {String(theme)}
          </li>
        </ul>
      </div>
    </DemoPage>
  );
}
