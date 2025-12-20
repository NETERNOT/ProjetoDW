function NewRecipe({ onClose }) {
    return (
        <div className="newRecipeContainer">
            <form className="newRecipe">
                <button type="button" className="closeButton" onClick={onClose}><span className="material-icons">close</span></button>
                <h1>Create New Recipe</h1>
                <p>Share your recipe with our community.</p>
                <label htmlFor="title">Title *</label>
                <input type="text" id="title" name="title" />
                <label htmlFor="description">Description *</label>
                <input type="text" id="description" name="description" />
                <label htmlFor="tags">Tags</label>
                <input type="text" id="tags" name="tags" />
                <div className="row">
                    <div>
                        <label htmlFor="cookingTime">Cooking Time *</label>
                        <input type="number" id="cookingTime" name="cookingTime" />
                    </div>
                    <div>
                        <label htmlFor="servings">Servings *</label>
                        <input type="number" id="servings" name="servings" />
                    </div>
                </div>
                <label htmlFor="image">Image URL (optional)</label>
                <input type="text" id="image" name="image" />
                <label htmlFor="ingredients">Ingredients *</label>
                <input type="text" id="ingredients" name="ingredients" />
                <label htmlFor="instructions">Instructions *</label>
                <input type="text" id="instructions" name="instructions" />
                <button type="submit">Create</button>
            </form>
        </div>
    );
}