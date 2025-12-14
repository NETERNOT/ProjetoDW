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
                    <svg></svg>
                </div>
                {recipe.tags.map(tag => (
                    <div className="">
                        <span>{tag}</span>
                    </div>))}
            </div>

            <div className="recipeCardBottom">
                <h3>{recipe.title}</h3>
                <p>
                    {recipe.description}
                </p>

                <div>
                    <div>
                        <svg></svg>
                        <span>{recipe.cookingTime}</span>
                    </div>
                    <div>
                        <svg></svg>
                        <span>{recipe.servings}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}