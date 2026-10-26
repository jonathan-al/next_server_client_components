import DemoPage from "@/components/DemoPage";

export const metadata = { title: "Static — fetch revalidate" };

// ISR set on a single fetch instead of on the route. The page takes the
// SHORTEST revalidate of everything it fetches, so one fetch is enough.
export default async function FetchRevalidatePage() {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos/2", {
    next: { revalidate: 10 },
  });
  const todo = await res.json();
  console.log("[Server Component] /static/fetch-revalidate — rendering");

  return (
    <DemoPage title="fetch with next: { revalidate: 10 }" build="○ (Static), revalidate 10s" pagesRouter="getStaticProps + revalidate: 10" section="static">
      <div className="note">
        <p>
          Same behaviour as <code>/static/revalidate</code>, but the 10 seconds are
          set on the <code>fetch</code> call, next to the data they refer to. The
          page is rebuilt when its data goes stale.
        </p>
        <p>
          Useful when one page mixes data with different freshness: the route
          follows the most demanding fetch.
        </p>
      </div>

      <div className="box server">
        <p className="stamp">Rendered at: {new Date().toISOString()}</p>
        <p>
          Todo #{todo.id}: <strong>{todo.title}</strong>
        </p>
      </div>
    </DemoPage>
  );
}
