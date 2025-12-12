const { useState, useEffect } = React;

function App() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch data when app starts
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

    const handleSeedData = async () => {
        await fetch('http://localhost:8000/api/seed');
        fetchRecipes(); // Refresh list after seeding
    };

    return (
        <div className="container">
            <header className="app-header">
                <h1>MyCookBook</h1>
                <button onClick={handleSeedData} className="btn-seed">
                    Load Dummy Data
                </button>
            </header>

            {loading ? (
                <p>Loading delicious recipes...</p>
            ) : (
                <div className="recipe-grid">
                    {recipes.map((recipe, index) => (
                        <div key={index} className="recipe-card">
                            <img src={recipe.picture} alt={recipe.title} className="recipe-img" />
                            <div className="recipe-content">
                                <h3>{recipe.title}</h3>
                                <p className="desc">{recipe.description}</p>
                                <div className="tags">
                                    {recipe.tags && recipe.tags.map(tag => (
                                        <span key={tag} className="tag">{tag}</span>
                                    ))}
                                </div>
                                <div className="meta">
                                    <span>⏱ {recipe.cookingTime} min</span>
                                    <span>👥 {recipe.servings} ppl</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {recipes.length === 0 && (
                        <p>No recipes found. Click "Load Dummy Data"!</p>
                    )}
                </div>
            )}
        </div>
    );
}

// Render the App
const root = ReactDOM.createRoot(document.getElementById('react-root'));
root.render(<App />);