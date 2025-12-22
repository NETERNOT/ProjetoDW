const { useState, useEffect } = React;

function App() {
  const [recipes, setRecipes] = useState([]);
  const [recipeId, setRecipeId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("home");

  const [loginImage, setLoginImage] = useState(null);

  const [userId, setUserId] = useState("6942a56f007469514fedf385");

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
        />
      )}

      {view === "recipe" && (
        <RecipeView
          recipe={recipes.find((recipe) => recipe._id === recipeId)}
          onBack={() => setView("home")}
          userId={userId}
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
