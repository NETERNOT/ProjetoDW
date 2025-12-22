function Comment({ comment }) {
    return (
        <div
            className="comment"
        >
            <p>{comment.user}</p>
            <p>{comment.text}</p>
        </div>
    );
}