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
            {loading ? (
                <p>Loading delicious recipes...</p>
            ) : (
                <HomeView recipes={recipes} />
                // <RecipeView recipe={recipes[0]} />
            )}
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('react-root'));
root.render(<App />);