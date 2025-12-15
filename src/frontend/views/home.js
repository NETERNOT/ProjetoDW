function HomeView({ recipes }) {

    return (
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
    );
}