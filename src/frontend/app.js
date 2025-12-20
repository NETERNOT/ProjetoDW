const { useState, useEffect } = React;

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [recipes, setRecipes] = useState([]);
  const [recipeId, setRecipeId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("login");

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

  /*  const handleSeedData = async () => {
     await fetch("http://localhost:8000/api/seed");
     fetchRecipes(); // Refresh list after seeding
   }; */

  if (view === "home") { console.log(userId) }
  return (
    <div className="container">
      {view === "home" &&
        <HomeView recipes={recipes} onSelect={(id) => { setRecipeId(id); setView("recipe") }} onSelectNew={() => document.querySelector(".newRecipeContainer").classList.remove("hidden")} onCloseNew={() => document.querySelector(".newRecipeContainer").classList.add("hidden")} />}

      {view === "recipe" &&
        <RecipeView recipe={recipes.find((recipe) => recipe._id === recipeId)} onBack={() => setView("home")} />}

      {(view === "login" || view == "signup") && (
        <LoginView
          view={view}
          setView={setView}
          setUserId={setUserId}
          imageSrc={loginImage}
        ></LoginView>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("react-root"));
root.render(<App />);