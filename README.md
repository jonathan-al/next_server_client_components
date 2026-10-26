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
npm run prod     # next build && next start: the real behaviour
```

Use `npm run prod` to study the cases. In `npm run dev` every page is rendered on
every request, so static and dynamic pages look the same. After the build, read
the route table:

| Symbol | Meaning |
|---|---|
| `○` | Static: rendered once, at build time |
| `●` | Static with parameters: some ids rendered at build time (`generateStaticParams`) |
| `ƒ` | Dynamic: rendered on every request |
| `10s` in the *Revalidate* column | Static, but rebuilt in the background at most every 10 seconds (ISR) |

The `/db` pages use `node:sqlite`, which ships with Node.js 22.13 or newer. The
database file `data/app.db` is created on first use and is not committed. Node
prints an "experimental" warning for it; that is expected.

## Coming from the Pages Router

| Pages Router | App Router |
|---|---|
| `getStaticProps` | An `async` Server Component. Static by default: it runs once, at build time (`/static`) |
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

## The cases

The home page is a dictionary of all of them. Every demo component sits in a
labelled box: green for a Server Component, orange for a Client Component.

### Fundamentals

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

### `/server` — what makes a page dynamic (`ƒ`)

An `async` Server Component becomes dynamic when it needs something only a real
request knows.

| Route | What triggers it | Pages Router |
|---|---|---|
| `/server` | `await searchParams` (`?limit=3`); also uses the Node.js `os` module | `getServerSideProps` |
| `/server/cookies` | `cookies()`, plus a Server Action that sets one | `req.cookies` |
| `/server/headers` | `headers()` | `req.headers` |
| `/server/connection` | `await connection()`: nothing to read, but the output must differ each time | — |
| `/server/no-store` | `fetch(url, { cache: 'no-store' })` | `getServerSideProps` |
| `/server/force-dynamic` | `export const dynamic = 'force-dynamic'` | `getServerSideProps` |
| `/server/params/[id]` | Dynamic route without `generateStaticParams` | `getServerSideProps` + `params` |

### `/static` — ways Next builds a page once (`○` and `●`)

| Route | Mechanism | Pages Router |
|---|---|---|
| `/static` | The default: no request data | `getStaticProps` |
| `/static/force-static` | `dynamic = 'force-static'`: `cookies()` and `headers()` return empty values | `getStaticProps` |
| `/static/error` | `dynamic = 'error'`: the build fails if the page would become dynamic | `getStaticProps` |
| `/static/revalidate` | `export const revalidate = 10` (ISR for the route) | `revalidate: 10` |
| `/static/fetch-revalidate` | `fetch(url, { next: { revalidate: 10 } })` (ISR on one fetch) | `revalidate: 10` |
| `/static/on-demand` | `revalidatePath()` from a Server Action | `res.revalidate()` |
| `/static/posts/[id]` | `generateStaticParams`: ids 1–3 at build time, others on first visit | `getStaticPaths` + `fallback: 'blocking'` |
| `/static/posts-strict/[id]` | The same plus `dynamicParams = false`: other ids are a 404 | `getStaticPaths` + `fallback: false` |

### `/db` — SQLite: the same data, four behaviours

[`lib/db.js`](lib/db.js) opens `data/app.db` with `node:sqlite`. All four pages show
the same books and the same **+1 like** button
([`BookList`](components/BookList.js)). The Server Actions are in
[`lib/db-actions.js`](lib/db-actions.js). What differs is how the page is built:

| Route | How | Does a like show up? |
|---|---|---|
| `/db/static-trap` | Plain query, nothing tells Next it is dynamic | **No.** `○`: frozen at the build-time value |
| `/db/connection` | `await connection()` before the query | Yes, on every reload (`ƒ`) |
| `/db/revalidate` | `revalidate = 10` | After up to 10 s, on the reload that follows |
| `/db/cached` | `unstable_cache` with a tag, and the action calls `updateTag('books')` | Yes, the action returns the fresh page |

Next cannot see inside a database call, and `node:sqlite` is synchronous, so a
query finishes during the build. That is why `/db/static-trap` freezes, and why
`/actions` needs `connection()`.

[`lib/notes.js`](lib/notes.js) and [`lib/db.js`](lib/db.js) import `server-only`, so
the build fails if a Client Component ever imports them.

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
13. Run `npm run prod` and compare `/server/connection` with the same page after
    removing `await connection()`: the route becomes `○` and the random number
    never changes. That is the whole job of `connection()`.
14. Open `/server/cookies`, press "Set dark", and look at DevTools → Application →
    Cookies. Then open the page in a private window: it has no cookie. The same
    URL, two different pages.
15. Open `/static/force-static` with a `theme` cookie set (from step 14): the page
    shows `undefined`. It never saw your request. Now change `force-static` to
    `force-dynamic`, build again, and the cookie appears.
16. In `app/static/error/page.js`, add `await cookies()` (from `next/headers`) and
    run `npm run build`. The build stops with an error instead of quietly making
    the page dynamic. Undo it.
17. Open `/static/posts/1`, then `/static/posts/4` and watch the terminal: post 4
    renders on its first visit only. Then try `/static/posts-strict/4`: a 404.
18. After `npm run prod`, press **+1 like** on `/db/static-trap` and reload: the
    number does not move. Open `/db/connection`: the like is there. Add
    `await connection()` to the trap page and the bug is gone.
19. On `/db/revalidate`, press a like and reload until the number changes. The
    first reload after 10 seconds serves the old page and starts a rebuild, so the
    number shows up one reload later.
20. On `/db/cached` and `/static/on-demand`, the button updates the page at once
    because the action's response carries the fresh render. A plain reload right
    after can still return the previous copy for a while, until the cache catches
    up (10 to 40 seconds in tests).
