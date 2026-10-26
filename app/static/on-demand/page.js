import DemoPage from "@/components/DemoPage";
import { refreshOnDemand } from "@/lib/actions";

export const metadata = { title: "Static — on-demand revalidation" };

// Static, with no timer. The page stays as built until something calls
// revalidatePath() for it. Here a Server Action does, when you press the button.
export default function OnDemandPage() {
  console.log("[Server Component] /static/on-demand — rendering");

  return (
    <DemoPage title="revalidatePath()" build="○ (Static)" pagesRouter="res.revalidate()" section="static">
      <div className="note">
        <p>
          Reload as often as you like: the timestamp does not change, because the
          page was built once. Press the button: a Server Action calls{" "}
          <code>{"revalidatePath(\"/static/on-demand\")"}</code>, the page is
          rebuilt, and the new timestamp appears at once: the response of the
          action carries the fresh page.
        </p>
        <p>
          A plain browser reload right after the click can still return the
          previous copy for a while, until the cache catches up. In tests it took
          between 10 and 40 seconds.
        </p>
        <p>
          Real apps call this after changing data (a new blog post, a price). It
          gives you static speed with updates exactly when you want them.
        </p>
      </div>

      <div className="box server">
        <p className="stamp">Rendered at: {new Date().toISOString()}</p>
        <form action={refreshOnDemand}>
          <button type="submit">Revalidate this page</button>
        </form>
      </div>
    </DemoPage>
  );
}
