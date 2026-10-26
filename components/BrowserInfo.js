"use client";

import { useEffect, useState } from "react";

// `window` and `navigator` only exist in the browser, so they are read inside
// an effect. Effects never run on the server, which is why the first render
// (the one that becomes HTML) can only show the "Waiting…" text.
export default function BrowserInfo() {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    console.log("[Client Component] BrowserInfo — effect running");

    function update() {
      setInfo({ language: navigator.language, width: window.innerWidth });
    }

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div className="box client">
      {info ? (
        <ul className="facts">
          <li>
            Browser language: <code>{info.language}</code>
          </li>
          <li>
            Window width: <code>{info.width}px</code> (resize the window)
          </li>
        </ul>
      ) : (
        <p className="stamp">Waiting for the browser…</p>
      )}
    </div>
  );
}
