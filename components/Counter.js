"use client";

import { useState } from "react";

// "use client" declares a boundary: this file, and everything it imports,
// belongs to the client bundle. Only a Client Component can use state and
// event handlers like onClick.
export default function Counter() {
  const [count, setCount] = useState(0);

  // Appears in the browser console on every click. On a full page load it also
  // appears once in the terminal: Client Components are rendered on the server
  // first, to produce the initial HTML.
  console.log("[Client Component] Counter — rendering, count =", count);

  return (
    <div className="box client">
      <p>
        Count: <strong>{count}</strong>
      </p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
