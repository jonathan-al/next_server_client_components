import { headers } from "next/headers";
import DemoPage from "@/components/DemoPage";

export const metadata = { title: "Server — headers()" };

// headers() is a request-time API, like cookies(): the headers belong to one
// specific request, so the page cannot be built ahead of time.
export default async function HeadersPage() {
  const requestHeaders = await headers();
  const userAgent = requestHeaders.get("user-agent");
  const language = requestHeaders.get("accept-language");
  console.log("[Server Component] /server/headers — rendering");

  return (
    <DemoPage title="headers()" build="ƒ (Dynamic)" pagesRouter="req.headers" section="server">
      <div className="note">
        <p>
          <code>await headers()</code> returns the headers your browser sent with
          this request. They change with the visitor, so the page renders on every
          request.
        </p>
        <p>
          Open this page with another browser, or change the language in your
          browser settings, and the values below change.
        </p>
      </div>

      <div className="box server">
        <p className="stamp">Rendered at: {new Date().toISOString()}</p>
        <ul className="facts">
          <li>
            <code>user-agent</code>: {userAgent}
          </li>
          <li>
            <code>accept-language</code>: {language}
          </li>
        </ul>
      </div>
    </DemoPage>
  );
}
