// No "use client" here, so this is a Server Component. It is async, so it can
// fetch its own data, and it stays on the server even though the page shows it
// inside a Client Component (see Collapsible).
export default async function Comments({ postId }) {
  console.log(`[Server Component] Comments — fetching comments for post ${postId}`);

  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${postId}/comments`,
  );
  const comments = await res.json();

  return (
    <div className="box server">
      <ul className="list">
        {comments.slice(0, 3).map((comment) => (
          <li className="item" key={comment.id}>
            <strong>{comment.name}</strong>
            <br />
            {comment.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
