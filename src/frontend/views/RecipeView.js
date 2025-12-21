function RecipeView({ recipe, comments, userId, onBack, onCommentPosted }) {
    const [commentText, setCommentText] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        try {
            const response = await fetch("http://localhost:8000/api/comments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userId,
                    recipeId: recipe._id,
                    text: commentText,
                }),
            });

            if (response.ok) {
                setCommentText("");
                if (onCommentPosted) onCommentPosted();
            } else {
                console.error("Failed to post comment");
            }
        } catch (error) {
            console.error("Error posting comment:", error);
        }
    };

    return (
        <div className="recipeDetailsContainer">
            <a onClick={onBack}>
                <span className="material-icons">arrow_back</span>
                <span>Back</span>
            </a>

            <div className="recipeContainer">
                <img
                    src={recipe.picture}
                    alt={recipe.title}
                />
                <div className="tags">
                    {recipe.tags.map((tag, index) => (
                        <span key={index}>{tag}</span>
                    ))}
                </div>
                <div className="details">
                    <h1>{recipe.title}</h1>
                    <p>{recipe.description}</p>

                    <div className="info">
                        <div>
                            <span className="material-icons">schedule</span>
                            <span>Time: {recipe.cookingTime} min</span>
                        </div>
                        <div>
                            <span className="material-icons">group</span>
                            <span>Servings: {recipe.servings}</span>
                        </div>
                    </div>

                    <div className="save">
                        <span className="material-icons">bookmark</span> Save
                    </div>
                    <div className="recipeLists">
                        <div className="ingredients">
                            Ingredients
                            <ul>
                                {recipe.ingredients.map((ingredient, index) => (
                                    <li key={index}>{ingredient}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="instructions">
                            Instructions
                            <ol>
                                {recipe.instructions.map((instruction, index) => (
                                    <li key={index}>{instruction}</li>
                                ))}
                            </ol>
                        </div>
                    </div>
                    <p>Created by: {recipe.createdBy.user}</p>
                </div>
                <div className="commentsContainer">
                    <h2>Comments</h2>
                    {comments && comments.length === 0 ? <p className="noComments">
                        There are no comments availble for this recipe. Be the first to share your opinion!</p>
                        : comments.map((comment, index) => (
                            <Comment key={index} comment={comment} />
                        ))}
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Write a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                        />
                        <button type="submit"><span className="material-icons">send</span></button>
                    </form>
                </div>
            </div>
        </div>
    );
}