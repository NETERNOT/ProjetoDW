const { useState, useEffect } = React;

function App() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecipes();
    }, []);

    const fetchRecipes = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/recipes');
            const data = await response.json();
            setRecipes(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching recipes:", error);
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <header className="app-header">
                <h1>MyCookBook</h1>
            </header>

            {loading ? (
                <p>Loading delicious recipes...</p>
            ) : (
                <div className="recipe-grid">
                    {recipes.map((recipe) => (
                        <RecipeCard recipe={recipe} />
                    ))}
                    {recipes.length === 0 && (
                        <p>No recipes found.</p>
                    )}
                </div>
            )}
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('react-root'));
root.render(<App />);