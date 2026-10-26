"use client";

import { useState } from "react";

// `posts` was fetched by the Server Component page and arrives here as a prop.
// Props that cross from server to client must be serializable: plain data
// (strings, numbers, arrays, objects). Functions cannot cross, with one
// exception: Server Actions.
export default function PostFilter({ posts }) {
  const [query, setQuery] = useState("");

  const visible = posts.filter((post) =>
    post.title.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="box client">
      <div className="form">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter posts by title…"
          aria-label="Filter posts by title"
        />
      </div>
      <p className="stamp">
        Showing {visible.length} of {posts.length} posts
      </p>
      <ul className="list">
        {visible.map((post) => (
          <li className="item" key={post.id}>
            <span className="id">#{post.id}</span>
            {post.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
