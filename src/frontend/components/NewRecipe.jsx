function NewRecipe() {
    return (
        <div className="newRecipe">
            <h1>Create New Recipe</h1>
            <p>Share your recipe with our community.</p>
            <form>
                <label htmlFor="title">Title</label>
                <input type="text" id="title" name="title" />
                <label htmlFor="description">Description</label>
                <textarea id="description" name="description"></textarea>
                <label htmlFor="ingredients">Ingredients</label>
                <textarea id="ingredients" name="ingredients"></textarea>
                <label htmlFor="instructions">Instructions</label>
                <textarea id="instructions" name="instructions"></textarea>
                <label htmlFor="cookingTime">Cooking Time</label>
                <input type="number" id="cookingTime" name="cookingTime" />
                <label htmlFor="servings">Servings</label>
                <input type="number" id="servings" name="servings" />
                <label htmlFor="tags">Tags</label>
                <input type="text" id="tags" name="tags" />
                <button type="submit">Create Recipe</button>
            </form>
        </div>
    );
}