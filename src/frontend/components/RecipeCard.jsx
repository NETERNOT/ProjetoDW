const { useState, useEffect } = React;

function RecipeCard({ recipe, onSelect, userId }) {
  const [user, setUser] = useState(null);
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
          alert(data.error);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        alert("An error occurred");
      }
    };
    fetchUser();
  }, [userId]);

  const saved = user ? user.savedRecipes.includes(recipe._id) : false;

  const toggleSave = async (e) => {
    e.stopPropagation();
    if (!user) return;

    const wasSaved = saved;
    const newSavedRecipes = wasSaved
      ? user.savedRecipes.filter(id => id !== recipe._id)
      : [...user.savedRecipes, recipe._id];

    setUser({ ...user, savedRecipes: newSavedRecipes });

    try {
      const response = await fetch(`http://localhost:80/api/toggleSavedRecipe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, recipeId: recipe._id }),
      });
      if (!response.ok) {
        setUser({ ...user, savedRecipes: user.savedRecipes });
        console.error("Failed to toggle save");
      }
    } catch (err) {
      setUser({ ...user, savedRecipes: user.savedRecipes });
      console.error("Error toggling save:", err);
    }
  };

  return (
    <div className="recipeCard" onClick={onSelect}>
      <div className="recipeCardTop">
        <img src={recipe.picture} alt={recipe.title} />
        <div className="recipeCardTopOverlay">
          <span className="material-icons" onClick={toggleSave}>{saved ? "bookmark" : "bookmark_border"}</span>
          <div className="tags">
            {(recipe.tags || []).map((tag, index) => (
              <span key={index}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="recipeCardBottom">
        <h3>{recipe.title}</h3>
        <p>{recipe.description}</p>

        <div className="info">
          <div>
            <span className="material-icons">schedule</span>
            <span>{recipe.cookingTime} min</span>
          </div>
          <div>
            <span className="material-icons">group</span>
            <span>{recipe.servings}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
