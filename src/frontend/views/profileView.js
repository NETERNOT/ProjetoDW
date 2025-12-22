const { useState, useEffect } = React;

function ProfileView({ userId , onSelect}) {
  const [user, setUser] = useState(null);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [createdRecipes, setCreatedRecipes] = useState([]);

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

        if (response.ok) {
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

    const fetchCreatedRecipes = async () => {
      if (!user) {
        setCreatedRecipes([]);
        return;
      }
      try {
        const response = await fetch(`http://localhost:8000/api/getRecipesByCreator`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ creatorId: userId }),
        });
        const data = await response.json();
        if (response.ok) {
          setCreatedRecipes(data);
        } else {
          console.error(
            "Fetch failed with status:",
            response.status,
            "data:",
            data
          );
        }
      } catch (err) {
        console.error("Error fetching created recipes:", err);
      }
    };

    fetchCreatedRecipes();
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
              <div>{savedRecipes.length}</div>
              <div>Saved Recipes</div>
            </div>

            <div>
              <div>{createdRecipes.length}</div>
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
                        onSelect={() => onSelect(recipe._id)}
                        userId={userId} />
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
