function HomeView({ recipes, userId, onSelect, onSelectNew, onCloseNew, onRecipeCreated }) {

    const tags = [...new Set(recipes.flatMap(recipe => recipe.tags))];

    const [filters, setFilters] = useState({
        query: "",
        tag: "",
        minTime: "",
        maxTime: "",
        minServings: "",
        maxServings: ""
    });

    const handleFilterChange = (field, value) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
    };

    const clearFilters = () => {
        setFilters({
            query: "",
            tag: "",
            minTime: "",
            maxTime: "",
            minServings: "",
            maxServings: ""
        });
    };

    const filteredRecipes = recipes.filter((recipe) => {
        const matchesQuery = recipe.title.toLowerCase().includes(filters.query.toLowerCase());

        const matchesTag = filters.tag === "" || recipe.tags.includes(filters.tag);

        const matchesMinTime = filters.minTime === "" || recipe.cookingTime >= parseInt(filters.minTime);
        const matchesMaxTime = filters.maxTime === "" || recipe.cookingTime <= parseInt(filters.maxTime);

        const matchesMinServings = filters.minServings === "" || recipe.servings >= parseInt(filters.minServings);
        const matchesMaxServings = filters.maxServings === "" || recipe.servings <= parseInt(filters.maxServings);

        return matchesQuery && matchesTag && matchesMinTime && matchesMaxTime && matchesMinServings && matchesMaxServings;
    });

    return (
        <div className="view-container">
            <FilterTab tags={tags}
                filters={filters}
                onFilterChange={handleFilterChange}
                onClear={clearFilters}
            />
            <div className="recipeGrid">
                {filteredRecipes.map((recipe) => (
                    <RecipeCard
                        key={recipe._id}
                        recipe={recipe}
                        onSelect={() => onSelect(recipe._id)}
                        userId={userId} />
                ))}
                {filteredRecipes.length === 0 && (
                    <p>No recipes found.</p>
                )}
            </div>
            <button className="newRecipeButton" onClick={onSelectNew}>+ New Recipe</button>
            <NewRecipe onClose={onCloseNew} userId={userId} onRecipeCreated={onRecipeCreated} />
        </div>
    );
}