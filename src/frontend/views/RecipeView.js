function RecipeView({ recipe, comments, userId, onBack, onCommentPosted }) {
  const { useState, useEffect } = React;
  const [commentText, setCommentText] = useState("");
  const [user, setUser] = useState(null);

  if (!recipe) return null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!userId) return;
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:80/api/getUser`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: userId }),
        });
        const data = await response.json();
        if (response.ok) {
          setUser(data.user);
        } else {
          console.error(data.error);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, [userId]);

  if (user) {
    console.log("RecipeView Debug:");
    console.log("User Saved Recipes:", user.savedRecipes);
    console.log("Current Recipe ID:", recipe._id);
    console.log("Recipe ID Type:", typeof recipe._id);
    if (user.savedRecipes.length > 0) {
      console.log("Saved Recipe Type:", typeof user.savedRecipes[0]);
    }
  }
  const saved = user && user.savedRecipes ? user.savedRecipes.some(id => String(id) === String(recipe._id)) : false;

  const toggleSave = async (e) => {
    e.stopPropagation();
    if (!user) {
      console.log("User not logged in, cannot save");
      return;
    }

    console.log("Toggling Save. Current state:", saved);

    const wasSaved = saved;
    const newSavedRecipes = wasSaved
      ? user.savedRecipes.filter((id) => String(id) !== String(recipe._id))
      : [...user.savedRecipes, recipe._id];

    setUser({ ...user, savedRecipes: newSavedRecipes });

    try {
      const response = await fetch(
        `http://localhost:80/api/toggleSavedRecipe`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, recipeId: recipe._id }),
        }
      );
      if (!response.ok) {
        setUser({ ...user, savedRecipes: user.savedRecipes });
        console.error("Failed to toggle save");
      }
    } catch (err) {
      setUser({ ...user, savedRecipes: user.savedRecipes });
      console.error("Error toggling save:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const response = await fetch("http://localhost:80/api/comments", {
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
    <div className="view-container">
      <a onClick={onBack}>
        <span className="material-icons">arrow_back</span>
        <span>Back</span>
      </a>

      <div className="recipeContainer">
        <img src={recipe.picture} alt={recipe.title} />
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

          <div className="save" onClick={toggleSave}>
            <span className="material-icons">
              {saved ? "bookmark" : "bookmark_border"}
            </span> {saved ? "Saved" : "Save"}
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
          {comments && comments.length > 0 ? (
            comments.map((comment, index) => (
              <Comment key={index} comment={comment} />
            ))
          ) : (
            <p className="noComments">
              There are no comments availble for this recipe. Be the first to share your opinion!
            </p>
          )}
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
