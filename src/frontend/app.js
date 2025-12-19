const { useState, useEffect } = React;

function App() {
    const [currentPath, setCurrentPath] = useState(window.location.hash.substring(1) || "/login");
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState("login");

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loginImage, setLoginImage] = useState(null);

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
    }, []);

    useEffect(() => {
        const handleLocationChange = () => {
            const path = window.location.hash.substring(1);
            setCurrentPath(path || "/login");
        };

        if (!window.location.hash) {
            window.location.hash = "/login";
        }

        window.addEventListener('hashchange', handleLocationChange);
        return () => window.removeEventListener('hashchange', handleLocationChange);
    }, []);

    const navigate = (path) => {
        window.location.hash = path;
        setCurrentPath(path);
    };

    const renderView = () => {
        if (loading) return <p>Loading...</p>;

        const recipeMatch = currentPath.match(/^\/recipe\/([a-zA-Z0-9]+)$/);

        if (recipeMatch) {
            const recipeId = recipeMatch[1];
            const recipe = recipes.find(r => r._id.toString() === recipeId.toString());
            return <RecipeView recipe={recipe} onBack={() => navigate('/home')} />;
        }

        if (["/login", "/signup", "login", "signup"].includes(currentPath)) {
            return <LoginView
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
                navigate={navigate}
            />;
        }
        if (currentPath === "/home" || currentPath === "home") {
            return <HomeView recipes={recipes} onSelect={(id) => navigate(`/recipe/${id}`)} onSelectNew={() => document.querySelector(".newRecipeContainer").classList.remove("hidden")} onCloseNew={() => document.querySelector(".newRecipeContainer").classList.add("hidden")} />;
        }
        if (currentPath === "/new" || currentPath === "new") {
            return <NewView />;
        }

        return <LoginView
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
            navigate={navigate}
        />;
    };

    return <div className="container">{renderView()}</div>;
}

const root = ReactDOM.createRoot(document.getElementById("react-root"));
root.render(<App />);