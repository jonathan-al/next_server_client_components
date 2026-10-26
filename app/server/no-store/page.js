import DemoPage from "@/components/DemoPage";

export const metadata = { title: "Server — fetch no-store" };

// A fetch with cache: 'no-store' says "never reuse this response". That alone
// makes the whole page dynamic: it cannot be built ahead of time if its data
// must be fresh.
export default async function NoStorePage() {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos/1", {
    cache: "no-store",
  });
  const todo = await res.json();
  console.log("[Server Component] /server/no-store — fetched a todo");

  return (
    <DemoPage title="fetch with cache: 'no-store'" build="ƒ (Dynamic)" pagesRouter="getServerSideProps" section="server">
      <div className="note">
        <p>
          The page uses no cookies, headers or <code>searchParams</code>. The only
          reason it is dynamic is{" "}
          <code>{"fetch(url, { cache: 'no-store' })"}</code>.
        </p>
        <p>
          Change it to <code>{"{ cache: 'force-cache' }"}</code>, build again and
          the page becomes <code>○</code>: its data is fetched once, at build time.
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
