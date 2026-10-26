import DemoPage from "@/components/DemoPage";

export const metadata = { title: "Server — force-dynamic" };

// The blunt tool: tell Next the whole page is dynamic, whatever it contains.
// Prefer connection() or a real request-time API: they are more precise and say
// WHY the page is dynamic. (export const revalidate = 0 has the same effect.)
export const dynamic = "force-dynamic";

export default function ForceDynamicPage() {
  console.log("[Server Component] /server/force-dynamic — rendering");

  return (
    <DemoPage title="dynamic = 'force-dynamic'" build="ƒ (Dynamic)" pagesRouter="getServerSideProps" section="server">
      <div className="note">
        <p>
          This page has no async work and reads nothing from the request. Next
          would normally build it once. The single line{" "}
          <code>{"export const dynamic = 'force-dynamic'"}</code> makes it render on
          every request.
        </p>
        <p>
          Same result as <code>/server/connection</code>, but set for the whole
          route from outside the component, instead of at one point inside it.
        </p>
      </div>

      <div className="box server">
        <p className="stamp">Rendered at: {new Date().toISOString()}</p>
      </div>
    </DemoPage>
  );
}
