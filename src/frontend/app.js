const { useState, useEffect } = React;

function App() {
    const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("login");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loginImage, setLoginImage] = useState(null);



  // Fetch data when app starts
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/recipes");
        const data = await response.json();
        setRecipes(data);
        setLoading(false);


        setLoginImage(recipes[Math.floor(Math.random() * recipes.length)]?.picture)
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

  return (
    <div className="container">
      {view === "home" && <div>Welcome Home!</div>}
      {(view === "login" || view == "signup") && (
        <LoginView
          view={view}
          setView={setView}
          email={email}
          setEmail={setEmail}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          imageSrc={loginImage}
        ></LoginView>
      )}
    </div>
  );
}

// Render the App
const root = ReactDOM.createRoot(document.getElementById("react-root"));
root.render(<App />);
