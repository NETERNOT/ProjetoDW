function RecipeDetails({ recipe, onBack }) {

    return (
        <div className="recipeDetailsContainer">
            <a onClick={onBack}>
                <span className="material-icons">arrow_back</span>
                <span>Home</span>
            </a>

            <div className="recipeContainer">
                <img
                    src={recipe.picture}
                    alt={recipe.title}
                />
                <div className="tags">
                    {recipe.tags.map((tag, index) => (
                        <span key={index}>{tag}</span>
                    ))}
                </div>
                <div className="details">
                    <h1>{recipe.title}</h1>
                    <p>
                        {recipe.description}
                    </p>

                    <div className="info">
                        <div>
                            <span className="material-icons">schedule</span>
                            <span>Time: {recipe.cookingTime} min</span>
                        </div>
                        <div>
                            <span className="material-icons">group</span>
                            <span>Servings: {recipe.servings}</span>
                        </div>
                    </div>

                    <div className="save">
                        <span className="material-icons">bookmark</span> Save
                    </div>
                    <div className="recipeLists">
                        <div className="ingredients">
                            Ingredients
                            <ul>
                                {recipe.ingredients.map((ingredient, index) => (
                                    <li key={index}>{ingredient}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="instructions">
                            Instructions
                            <ol>
                                {recipe.instructions.map((instruction, index) => (
                                    <li key={index}>{instruction}</li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}