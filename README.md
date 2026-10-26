# Next.js App Router: Server Components, Client Components and Server Actions

A small demo of the three ideas that replace `getStaticProps`,
`getServerSideProps` and API routes in the App Router. It uses the free
[JSONPlaceholder](https://jsonplaceholder.typicode.com) API and one small JSON
file as a stand-in for a database.

Built with Next.js 16 and the **App Router** (`app/`). It is the follow-up to
the Pages Router data fetching demo (`next_get_props`).

## Run it

```bash
npm run dev      # development: every page is rendered on every request
```

To see how static and dynamic pages really differ, build first:

```bash
npm run build    # watch which routes are marked ○ (static) and ƒ (per request)
npm start
```

## Coming from the Pages Router

| Pages Router | App Router |
|---|---|
| `getStaticProps` | An `async` Server Component. Static by default: it runs once, at build time |
| `getServerSideProps` | An `async` Server Component that reads request data (`searchParams`, `cookies()`, `headers()`), so it runs on every request |
| `pages/api/*` plus a client `fetch` to save data | A Server Action |
| Every page component is hydrated in the browser | Components stay on the server unless the file starts with `"use client"` |

## Server vs Client Components

Everything in `app/` is a **Server Component** unless the file starts with
`"use client"`.

| | Server Component (default) | Client Component (`"use client"`) |
|---|---|---|
| Runs | On the server only | On the server for the first HTML, then in the browser |
| Can be `async` and `await` data | Yes | No |
| `useState`, `useEffect`, `onClick` | No | Yes |
| `window`, `localStorage` | No | Yes (inside effects and handlers) |
| Files, databases, secrets | Yes | No |
| Its JavaScript is sent to the browser | No | Yes |

A **Server Action** is an `async` function marked `"use server"`. It runs on the
server, but you pass it to a `<form action={...}>` and Next sends the POST
request for you. Every Server Action is a public endpoint, so a real app must
check authentication inside it.

## The pages

Every demo component sits in a labelled box: green for a Server Component,
orange for a Client Component. Boxes nest, so you can see the boundaries.

- [`app/server/page.js`](app/server/page.js) — **Server Component**. The page is
  `async` and fetches the users itself. It reads `?limit=3` from the URL, so it
  renders on every request. It also uses the Node.js `os` module, which only
  works on the server.
- [`app/static/page.js`](app/static/page.js) — **Static page**. The same Server
  Component without `searchParams`. It reads no request data, so Next renders it
  once at `npm run build`, like `getStaticProps`, and serves that HTML to
  everyone.
- [`app/client/page.js`](app/client/page.js) — **Client Components**. The page
  stays a Server Component and renders two small interactive pieces:
  [`Counter`](components/Counter.js) (`useState`, `onClick`) and
  [`BrowserInfo`](components/BrowserInfo.js) (`useEffect`, `window`,
  `navigator`).
- [`app/composition/page.js`](app/composition/page.js) — **Both together**.
  [`PostFilter`](components/PostFilter.js) receives server data through props.
  [`Collapsible`](components/Collapsible.js) is a Client Component that shows
  [`Comments`](components/Comments.js), a Server Component it receives as
  `children`.
- [`app/actions/page.js`](app/actions/page.js) — **Server Actions**. Notes are
  stored in [`data/notes.json`](data/notes.json). The actions live in
  [`lib/actions.js`](lib/actions.js). [`NoteForm`](components/NoteForm.js) adds a
  note with `useActionState`, and each Delete button is a plain form in the
  Server Component. The page calls `await connection()` so it renders on every
  request; without it, Next would prerender the page at build time and serve
  that old list.

[`lib/notes.js`](lib/notes.js) imports `server-only`, so the build fails if a
Client Component ever imports it.

## Where do the logs appear?

Every component logs when it renders, with a `[Server Component]`,
`[Client Component]` or `[Server Action]` prefix.

- Server code logs in the **terminal**. In `npm run dev`, React also replays
  Server Component logs in the browser console with a gray "Server" badge. They
  still ran on the server.
- A Client Component logs in the **browser** on every render. On a full page
  load it also logs once in the terminal, because the server pre-renders it to
  produce the first HTML.
- In `npm run dev`, React Strict Mode renders Client Components and runs effects
  **twice** on purpose, so those browser logs appear twice. It does not happen
  in production.
- A static page (`○`) renders at `npm run build`, so after `npm start` its
  Server Component logs never appear again.

## Things to try

1. `npm run dev` and open `/server`. The terminal logs
   `[Server Component] /server — rendering`. Press Ctrl+U to view the page
   source: the users are already in the HTML. Then try `/server?limit=3`.
2. In `app/server/page.js`, add `import { useState } from "react"` and call
   `useState(0)` inside the component. Next stops with an error that tells you to
   add `"use client"`. Undo it.
3. Open `/client` and click Increment. Each render logs in the browser console,
   and the green timestamp does not change: no request went to the server. Now
   reload the page: the terminal also logs `Counter — rendering, count = 0`.
4. Delete the `"use client"` line from `components/Counter.js`. You get the same
   error, with an import trace that points at `app/client/page.js`. Put it back.
5. Open `/composition` and press Ctrl+U: the comments are in the HTML even while
   collapsed. Toggle the button a few times. Only `Collapsible` logs. `Comments`
   never runs again.
6. Open `/actions` and add a note. The terminal logs
   `[Server Action] createNote — running`, `data/notes.json` changes, and
   DevTools → Network shows a POST. Try a note with one or two characters: the
   error appears and your text stays in the input.
7. In `lib/actions.js`, comment out the `revalidatePath("/actions")` lines. Add a
   note: nothing changes on screen until you reload the page. Put them back.
8. In DevTools press Ctrl+Shift+P, run "Disable JavaScript" and reload `/actions`.
   Delete still works, and so does Add. A form that calls a Server Action is
   plain HTML first, and JavaScript only enhances it.
9. In `components/NoteForm.js`, add `import { getNotes } from "@/lib/notes"`. The
   `server-only` guard stops it, and the import trace shows the chain from the
   Client Component to `lib/notes.js`. Undo it.
10. `npm run build` and read the route table. `/server` and `/actions` are `ƒ`
    (rendered on demand), and `/`, `/static`, `/client` and `/composition` are
    `○` (prerendered). Remove `await connection()` from `app/actions/page.js`,
    build again, and `/actions` becomes `○`.
11. After `npm run build && npm start`, open `/static` and reload a few times.
    The timestamp never changes and the terminal stays quiet: the page rendered
    once, during the build. Do the same on `/server`: every reload logs in the
    terminal and shows a new timestamp.
12. In `app/static/page.js`, add `export const revalidate = 10` and build again.
    The route table shows `10s` next to `/static`. Wait 10 seconds and reload:
    you still get the old page, but the terminal logs a new render. Reload once
    more to see the new timestamp. This is `getStaticProps` with
    `revalidate: 10` (Incremental Static Regeneration). Remove the line.
