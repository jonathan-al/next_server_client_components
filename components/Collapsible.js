"use client";

import { useState } from "react";

// A Client Component that receives a Server Component as `children`.
//
// The children were already rendered on the server before this component runs.
// All Collapsible does is hide or show that finished output, so toggling never
// triggers a new fetch. `hidden` (instead of `{open && children}`) keeps the
// content in the HTML even while it is collapsed.
export default function Collapsible({ title, children }) {
  const [open, setOpen] = useState(false);
  console.log("[Client Component] Collapsible — rendering, open =", open);

  return (
    <div className="box client">
      <button className="secondary" onClick={() => setOpen(!open)}>
        {open ? "Hide" : "Show"} {title}
      </button>
      <div hidden={!open} style={{ marginTop: "1rem" }}>
        {children}
      </div>
    </div>
  );
}
