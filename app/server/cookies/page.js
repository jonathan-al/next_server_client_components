import { cookies } from "next/headers";
import DemoPage from "@/components/DemoPage";
import { setTheme, clearTheme } from "@/lib/actions";

export const metadata = { title: "Server — cookies()" };

// cookies() is a request-time API: the answer depends on who is asking, so Next
// cannot know it at build time. Calling it makes the page render on every request.
export default async function CookiesPage() {
  const theme = (await cookies()).get("theme")?.value ?? "(no cookie yet)";
  console.log(`[Server Component] /server/cookies — theme=${theme}`);

  return (
    <DemoPage title="cookies()" build="ƒ (Dynamic)" pagesRouter="req.cookies" section="server">
      <div className="note">
        <p>
          <code>await cookies()</code> reads the cookies of the current request, so
          this page is rendered again for every visitor. Two browsers can see
          different values from the same URL.
        </p>
        <p>
          The buttons call a Server Action that sets a cookie. Reload the page, then
          look at DevTools → Application → Cookies: the cookie is named{" "}
          <code>theme</code>.
        </p>
      </div>

      <div className="box server">
        <p className="stamp">Rendered at: {new Date().toISOString()}</p>
        <p>
          Cookie <code>theme</code>: <strong>{theme}</strong>
        </p>
        <div className="form">
          <form action={setTheme}>
            <input type="hidden" name="theme" value="dark" />
            <button type="submit">Set dark</button>
          </form>
          <form action={setTheme}>
            <input type="hidden" name="theme" value="light" />
            <button type="submit">Set light</button>
          </form>
          <form action={clearTheme}>
            <button className="secondary" type="submit">
              Delete cookie
            </button>
          </form>
        </div>
      </div>
    </DemoPage>
  );
}
