import DemoPage from "@/components/DemoPage";

export const metadata = { title: "Static — revalidate" };

// Incremental Static Regeneration (ISR) for the whole route: built once, then
// rebuilt in the background at most every 10 seconds.
export const revalidate = 10;

export default function RevalidatePage() {
  console.log("[Server Component] /static/revalidate — rendering");

  return (
    <DemoPage title="export const revalidate = 10" build="○ (Static), revalidate 10s" pagesRouter="getStaticProps + revalidate: 10" section="static">
      <div className="note">
        <p>
          The page is built at <code>npm run build</code>. After 10 seconds, the
          next visit still receives the OLD page, instantly, and triggers a rebuild
          in the background. The visit after that gets the new page.
        </p>
        <p>
          Reload right away: nothing changes. Wait 10 seconds and reload: same old
          timestamp, but the terminal logs a render. Reload once more: the new
          timestamp. This is called stale-while-revalidate.
        </p>
      </div>

      <div className="box server">
        <p className="stamp">Rendered at: {new Date().toISOString()}</p>
      </div>
    </DemoPage>
  );
}
