// A real (tiny) database for the /db demos. It uses node:sqlite, the SQLite
// driver that ships with Node.js, so there is nothing to install or compile.
// The file data/app.db is created on first use and is not committed to git.
//
// node:sqlite is SYNCHRONOUS: a query finishes the moment it is called. That
// matters for Next.js: it cannot tell that a page reads a database, so it
// treats the page as static unless you opt out (see /db/static-trap).
import "server-only";
import { DatabaseSync } from "node:sqlite";
import path from "node:path";

const globalForDb = globalThis;

function openDatabase() {
  const db = new DatabaseSync(path.join(process.cwd(), "data", "app.db"));
  // `next build` renders pages in parallel workers that share this file.
  db.exec("PRAGMA busy_timeout = 5000");
  db.exec(`
    CREATE TABLE IF NOT EXISTS books (
      id    INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      likes INTEGER NOT NULL DEFAULT 0
    );
    INSERT OR IGNORE INTO books (id, title) VALUES
      (1, 'The Pragmatic Programmer'),
      (2, 'Designing Data-Intensive Applications'),
      (3, 'Refactoring');
  `);
  return db;
}

// Kept on globalThis so `next dev` hot reloads reuse one connection.
const db = (globalForDb.__booksDb ??= openDatabase());

export function getBooks() {
  return db.prepare("SELECT id, title, likes FROM books ORDER BY id").all();
}

export function likeBook(id) {
  db.prepare("UPDATE books SET likes = likes + 1 WHERE id = ?").run(id);
}

export function resetLikes() {
  db.exec("UPDATE books SET likes = 0");
}
