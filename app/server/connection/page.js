import { connection } from "next/server";
import DemoPage from "@/components/DemoPage";

export const metadata = { title: "Server — connection()" };

// This page reads no request data at all, so Next would prerender it. But it
// needs a different answer each time (random number, current time). connection()
// says "wait for a real request before going on", which is the way to say
// "this is dynamic" when you have no cookies, headers or searchParams to read.
export default async function ConnectionPage() {
  await connection(); // prerendering stops here

  // The lint rule warns about impure calls during render. After connection()
  // this code runs once per request, which is exactly what we want here.
  // eslint-disable-next-line react-hooks/purity
  const lucky = Math.floor(Math.random() * 1000);
  console.log(`[Server Component] /server/connection — lucky number ${lucky}`);

  return (
    <DemoPage title="connection()" build="ƒ (Dynamic)" section="server">
      <div className="note">
        <p>
          Nothing in this page depends on the request, yet its output must differ
          every time: a random number and the current time. Next cannot see that,
          so you tell it with <code>await connection()</code>.
        </p>
        <p>
          Remove that line, run <code>npm run prod</code> and reload: the number
          never changes, because the page was built once. Compare with{" "}
          <code>/static</code>. The same call is used in <code>/actions</code> and{" "}
          <code>/db/connection</code>.
        </p>
      </div>

      <div className="box server">
        <p className="stamp">Rendered at: {new Date().toISOString()}</p>
        <p>
          Random number: <strong>{lucky}</strong>
        </p>
      </div>
    </DemoPage>
  );
}
