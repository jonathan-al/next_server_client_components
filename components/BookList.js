// Renders the books read from SQLite, each with a "+1 like" button. The page
// decides which Server Action the button calls (the `action` prop), because
// what happens after the write is exactly what the /db pages compare.
// A Server Component can receive a Server Action as a prop and pass it to a form.
export default function BookList({ books, action }) {
  return (
    <>
      <p className="stamp">Rendered at: {new Date().toISOString()}</p>
      <ul className="list">
        {books.map((book) => (
          <li className="item row" key={book.id}>
            <span>
              <span className="id">#{book.id}</span>
              {book.title} — <strong>{book.likes}</strong> likes
            </span>
            <form action={action}>
              <input type="hidden" name="id" value={book.id} />
              <button className="secondary" type="submit">
                +1 like
              </button>
            </form>
          </li>
        ))}
      </ul>
    </>
  );
}
