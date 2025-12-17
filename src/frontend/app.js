const { useState, useEffect } = React;

function App() {
    const [currentPath, setCurrentPath] = useState(window.location.pathname);
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleLocationChange = () => {
        setCurrentPath(window.location.pathname);
    };

    const fetchRecipes = async () => {
        try {
            const response = await fetch('http://localhost:80/api/recipes');
            const data = await response.json();
            setRecipes(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching recipes:", error);
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchRecipes();

        window.addEventListener('popstate', handleLocationChange);
        return () => window.removeEventListener('popstate', handleLocationChange);
    }, []);

    const navigate = (path) => {
        window.history.pushState({}, "", path);
        setCurrentPath(path);
    };

    const renderView = () => {
        if (loading) return <p>Loading...</p>;

        const recipeMatch = currentPath.match(/^\/recipe\/([a-zA-Z0-9]+)$/);

        if (recipeMatch) {
            const recipeId = recipeMatch[1];
            const recipe = recipes.find(r => r._id.toString() === recipeId.toString());
            return <RecipeView recipe={recipe} onBack={() => navigate('/')} />;
        }

        return <HomeView recipes={recipes} onSelect={(id) => navigate(`/recipe/${id}`)} />;
    };

    return <div className="container">{renderView()}</div>;
}

const root = ReactDOM.createRoot(document.getElementById('react-root'));
root.render(<App />);