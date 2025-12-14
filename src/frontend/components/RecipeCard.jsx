function RecipeCard({ recipe }) {
    return (
        <div
            className="recipeCard"
        >
            <div className="recipeCardTop">
                <img
                    src={recipe.picture}
                    alt={recipe.title}
                />
                <div>
                    <span className="material-icons">bookmark</span>
                </div>
                <div className="tags">
                    {recipe.tags.map((tag, index) => (
                        <span key={index}>{tag}</span>
                    ))}
                </div>
            </div>

            <div className="recipeCardBottom">
                <h3>{recipe.title}</h3>
                <p>
                    {recipe.description}
                </p>

                <div className="info">
                    <div>
                        <span className="material-icons">schedule</span>
                        <span>{recipe.cookingTime}</span>
                    </div>
                    <div>
                        <span className="material-icons">group</span>
                        <span>{recipe.servings}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}