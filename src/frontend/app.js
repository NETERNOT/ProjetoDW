const { useState, useEffect } = React;

function App() {
  const [recipes, setRecipes] = useState([]);
  const [recipeId, setRecipeId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("login");

  const [loginImage, setLoginImage] = useState(null);

  const [userId, setUserId] = useState(null);
  const [comments, setComments] = useState([]); // Add comments state

  // Fetch data when app starts
  const [refreshRecipes, setRefreshRecipes] = useState(0);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/recipes");
        const data = await response.json();
        setRecipes(data);
        setLoading(false);

        if (data.length > 0 && !loginImage) {
          setLoginImage(data[Math.floor(Math.random() * data.length)]?.picture);
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [refreshRecipes]);

  const [refreshComments, setRefreshComments] = useState(0);

  useEffect(() => {
    if (view === "recipe" && recipeId) {
      const fetchComments = async () => {
        try {
          const response = await fetch("http://localhost:8000/api/comments");
          const data = await response.json();

          const filteredComments = data.filter(comment => {
            const commentRecipeId = comment.recipe?.$oid || comment.recipe;
            const targetId = recipeId?.$oid || recipeId;
            return commentRecipeId === targetId;
          });

          setComments(filteredComments);
        } catch (error) {
          console.error("Error fetching comments:", error);
        }
      };

      fetchComments();
    }
  }, [recipeId, view, refreshComments]);

  if (view === "home") { console.log(userId) }
  return (
    <div className="app-container">
      {(view === "login" || view == "signup") && (
        <LoginView
          view={view}
          setView={setView}
          setUserId={setUserId}
          imageSrc={loginImage}
        ></LoginView>
      )}

      {view !== "login" && view !== "signup" && (
        <NavBar setView={setView} setUserId={setUserId}></NavBar>
      )}

      {view === "home" && (
        <HomeView
          recipes={recipes}
          userId={userId}
          onSelect={(id) => {
            setRecipeId(id);
            setView("recipe");
          }}
          onSelectNew={() =>
            document
              .querySelector(".newRecipeContainer")
              .classList.remove("hidden")
          }
          onCloseNew={() =>
            document
              .querySelector(".newRecipeContainer")
              .classList.add("hidden")
          }
          onRecipeCreated={() => setRefreshRecipes((prev) => prev + 1)}
        />
      )}

      {view === "recipe" && (
        <RecipeView
          recipe={recipes.find((recipe) => recipe._id === recipeId)}
          onBack={() => setView("home")}
          userId={userId}
          comments={comments}
          onCommentPosted={() => setRefreshComments(prev => prev + 1)}
        />
      )}

      {view === "profile" && (
        <ProfileView
          userId={userId}
          onSelect={(id) => {
            setRecipeId(id);
            setView("recipe");
          }}
        ></ProfileView>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("react-root"));
root.render(<App />);
