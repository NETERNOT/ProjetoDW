const { useState, useEffect } = React;

function ProfileView({ userId }) {
  const [user, setUser] = useState(null);
  userId = "6942a56f007469514fedf385";
  const [savedRecipes, setSavedRecipes] = useState([]); // New state for saved recipes

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/getUser`, {
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
    if (userId) fetchUser();
  }, [userId]);

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      if (!user || !user.savedRecipes || user.savedRecipes.length === 0) {
        setSavedRecipes([]);
        return;
      }
      console.log("Fetching saved recipes with idList:", user.savedRecipes); // Add this
      try {
        const response = await fetch(`http://localhost:8000/api/recipesById`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idList: user.savedRecipes }),
        });
        const data = await response.json();
        console.log("Response status:", response.status); // Add this
        console.log("Response data:", data); // Add this
        if (response.ok) {
          console.log("Setting savedRecipes to:", data); // Add this
          setSavedRecipes(data);
        } else {
          console.error(
            "Fetch failed with status:",
            response.status,
            "data:",
            data
          );
        }
      } catch (err) {
        console.error("Error fetching saved recipes:", err);
      }
    };
    fetchSavedRecipes();
  }, [user]);

  const showNoSavedRecipes = !user || user.savedRecipes.length === 0;

  return (
    <div className="profileViewContainer">
      <div className="userInfoContainer">
        <div>
          <div className="iconContainer">
            <span className="material-icons">person</span>
          </div>
          <div>
            <h2>{user ? user.username : "User not Found."}</h2>
          </div>
        </div>

        {user && (
          <div className="stats">
            <div>
              <div>{user.savedRecipes.length}</div>
              <div>Saved Recipes</div>
            </div>

            <div>
              <div>{"3"}</div>
              <div>Created Recipes</div>
            </div>
          </div>
        )}
      </div>

      <label>
        <img></img>
        <h2>
          <span className="material-symbols-outlined">bookmark_star</span> Saved
          Recipes
        </h2>
      </label>

      <div className="savedRecipesContainer">
        {user && user.savedRecipes.length > 0 && (
          <>
            {savedRecipes.map((recipe) => (
               <RecipeCard
                        key={recipe._id}
                        recipe={recipe}
                        onSelect={() => onSelect(recipe._id)} />
            ))}
          </>
        )}

        {showNoSavedRecipes && (
          <div className="noSavedRecipes">
            <span className="material-symbols-outlined">bookmark_star</span>
            <p>No saved recipes yet.</p>
            <p>
              Start exploring and save your favorite recipes to see them here!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
