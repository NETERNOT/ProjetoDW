function HomeView({ recipes }) {
    const tags = [...new Set(recipes.flatMap(recipe => recipe.tags))];
    
    return (
        <div className="container">
            <FilterTab tags={tags} />
            <div className="recipeGrid">
                {recipes.map((recipe) => (
                    <RecipeCard
                        key={recipe._id}
                        recipe={recipe} />
                ))}
                {recipes.length === 0 && (
                    <p>No recipes found.</p>
                )}
            </div>
        </div>
    );
}