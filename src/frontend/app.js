const { useState, useEffect } = React;

function App() {
  const [recipes, setRecipes] = useState([]);
  const [recipeId, setRecipeId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("login");
  const [comments, setComments] = useState([]);

  const [loginImage, setLoginImage] = useState(null);

  const [userId, setUserId] = useState(null)


  // Fetch data when app starts
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/recipes");
        const data = await response.json();
        setRecipes(data);
        setLoading(false);

        if (data.length > 0) {
          setLoginImage(data[Math.floor(Math.random() * data.length)]?.picture);
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [recipes.length]);

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
    <div className="container">
      {view === "home" &&
        <HomeView recipes={recipes} userId={userId} onSelect={(id) => { setRecipeId(id); setView("recipe") }} onSelectNew={() => document.querySelector(".newRecipeContainer").classList.remove("hidden")} onCloseNew={() => document.querySelector(".newRecipeContainer").classList.add("hidden")} />}

      {view === "recipe" &&
        <RecipeView
          recipe={recipes.find((recipe) => recipe._id === recipeId)}
          comments={comments}
          userId={userId}
          onBack={() => setView("home")}
          onCommentPosted={() => setRefreshComments(prev => prev + 1)}
        />}

      {(view === "login" || view == "signup") && (
        <LoginView
          view={view}
          setView={setView}
          setUserId={setUserId}
          imageSrc={loginImage}
        ></LoginView>
      )}

      {view === "profile" &&
        <ProfileView userId={userId} onSelect={(id) => { setRecipeId(id); setView("recipe") }}></ProfileView>
      }
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("react-root"));
root.render(<App />);