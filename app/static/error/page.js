import DemoPage from "@/components/DemoPage";

export const metadata = { title: "Static — dynamic = error" };

// A guarantee instead of a guess. With 'error', the build FAILS if anything in
// this route would make it dynamic: cookies(), headers(), searchParams,
// connection(), a no-store fetch... Nobody can break its staticness by accident.
export const dynamic = "error";

export default function ErrorPage() {
  console.log("[Server Component] /static/error — rendering");

  return (
    <DemoPage title="dynamic = 'error'" build="○ (Static)" pagesRouter="getStaticProps" section="static">
      <div className="note">
        <p>
          Same result as a normal static page, plus a safety net. Try it: add{" "}
          <code>{"import { cookies } from \"next/headers\""}</code> and call{" "}
          <code>await cookies()</code> in this file, then run{" "}
          <code>npm run build</code>. The build stops with an error instead of
          quietly turning the page dynamic.
        </p>
      </div>

      <div className="box server">
        <p className="stamp">Rendered at: {new Date().toISOString()}</p>
      </div>
    </DemoPage>
  );
}
