import DemoPage from "@/components/DemoPage";

export const metadata = { title: "Server — revalidate = 0" };

// revalidate = 0 means "a cached render is stale immediately": the page renders
// on every request. Same effect as dynamic = "force-dynamic" here, but it is a
// cache lifetime, so a positive number (e.g. 60) turns the page into ISR instead.
export const revalidate = 0;

export default function RevalidateZeroPage() {
  console.log("[Server Component] /server/revalidate-0 — rendering");

  return (
    <DemoPage title="revalidate = 0" build="ƒ (Dynamic)" pagesRouter="getServerSideProps" section="server">
      <div className="note">
        <p>
          This page has no async work and reads nothing from the request. Next
          would normally build it once. The single line{" "}
          <code>{"export const revalidate = 0"}</code> makes it render on every
          request.
        </p>
        <p>
          Same result as <code>/server/force-dynamic</code>. The difference is
          the meaning: <code>revalidate</code> is how long a render may be reused.
          Zero means never; <code>60</code> would mean ISR, rebuilt at most once
          a minute.
        </p>
      </div>

      <div className="box server">
        <p className="stamp">Rendered at: {new Date().toISOString()}</p>
      </div>
    </DemoPage>
  );
}
