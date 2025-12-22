function NewRecipe({ onClose, userId, onRecipeCreated }) {
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [selectedTags, setSelectedTags] = React.useState([]);
    const [availableTags, setAvailableTags] = React.useState([]);
    const [cookingTime, setCookingTime] = React.useState('');
    const [servings, setServings] = React.useState('');
    const [picture, setPicture] = React.useState('');
    const [ingredients, setIngredients] = React.useState(['']);
    const [instructions, setInstructions] = React.useState(['']);

    React.useEffect(() => {
        fetch('http://localhost:8000/api/tags')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setAvailableTags(data);
                }
            })
            .catch(err => console.error("Failed to load tags", err));
    }, []);

    const handleTagClick = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            if (selectedTags.length < 2) {
                setSelectedTags([...selectedTags, tag]);
            } else {
                alert("You can only select up to 2 tags.");
            }
        }
    };

    const handleAddIngredient = () => {
        setIngredients([...ingredients, '']);
    };

    const handleIngredientChange = (index, value) => {
        const newIngredients = [...ingredients];
        newIngredients[index] = value;
        setIngredients(newIngredients);
    };

    const handleRemoveIngredient = (index) => {
        const newIngredients = ingredients.filter((_, i) => i !== index);
        setIngredients(newIngredients);
    };

    const handleAddInstruction = () => {
        setInstructions([...instructions, '']);
    };

    const handleInstructionChange = (index, value) => {
        const newInstructions = [...instructions];
        newInstructions[index] = value;
        setInstructions(newInstructions);
    };

    const handleRemoveInstruction = (index) => {
        const newInstructions = instructions.filter((_, i) => i !== index);
        setInstructions(newInstructions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const recipeData = {
            title,
            description,
            tags: selectedTags,
            cookingTime: Number(cookingTime),
            servings: Number(servings),
            picture,
            ingredients: ingredients.filter(i => i.trim() !== ''),
            instructions: instructions.filter(i => i.trim() !== ''),
            userId: userId
        };

        try {
            const response = await fetch('http://localhost:8000/api/recipes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(recipeData)
            });

            if (response.ok) {
                alert('Recipe created successfully!');
                if (onRecipeCreated) onRecipeCreated();
                onClose();
            } else {
                alert('Failed to create recipe');
            }
        } catch (error) {
            console.error('Error creating recipe:', error);
            alert('Error creating recipe');
        }
    };

    return (
        <div className="newRecipeContainer hidden">
            <form className="newRecipe" onSubmit={handleSubmit}>
                <button type="button" className="closeButton" onClick={onClose}><span className="material-icons">close</span></button>
                <h1>Create New Recipe</h1>
                <p>Share your recipe with our community.</p>

                <label htmlFor="title">Title *</label>
                <input type="text" id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required />

                <label htmlFor="description">Description *</label>
                <input type="text" id="description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} required />

                <label>Tags (Select max 2)</label>
                <div className="tags-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                    {availableTags.map(tag => (
                        <button
                            key={tag}
                            type="button"
                            onClick={() => handleTagClick(tag)}
                            className={`tag-chip ${selectedTags.includes(tag) ? 'selected' : ''}`}
                            style={{
                                padding: '6px 12px',
                                borderRadius: '16px',
                                border: '1px solid #ccc',
                                background: selectedTags.includes(tag) ? '#ff6347' : '#f0f0f0',
                                color: selectedTags.includes(tag) ? 'white' : '#333',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            {tag}
                        </button>
                    ))}
                    {availableTags.length === 0 && <span style={{ fontSize: '12px', color: '#666' }}>No existing tags found.</span>}
                </div>

                <div className="row">
                    <div>
                        <label htmlFor="cookingTime">Cooking Time (min) *</label>
                        <input type="number" id="cookingTime" name="cookingTime" value={cookingTime} onChange={(e) => setCookingTime(e.target.value)} required />
                    </div>
                    <div>
                        <label htmlFor="servings">Servings *</label>
                        <input type="number" id="servings" name="servings" value={servings} onChange={(e) => setServings(e.target.value)} required />
                    </div>
                </div>

                <label htmlFor="picture">Image URL (optional)</label>
                <input type="text" id="picture" name="picture" value={picture} onChange={(e) => setPicture(e.target.value)} />

                <div className="row">
                    <label>Ingredients *</label>
                    <button type="button" onClick={handleAddIngredient} className="add-btn">+ Add</button>
                </div>
                {ingredients.map((ingredient, index) => (
                    <div key={index} className="dynamic-input-row">
                        <input
                            type="text"
                            value={ingredient}
                            onChange={(e) => handleIngredientChange(index, e.target.value)}
                            placeholder={`Ingredient ${index + 1}`}
                            required
                        />
                        {ingredients.length > 1 && (
                            <button type="button" onClick={() => handleRemoveIngredient(index)} className="remove-btn">
                                <span className="material-icons">delete</span>
                            </button>
                        )}
                    </div>
                ))}
                <div className="row">
                    <label>Instructions *</label>
                    <button type="button" onClick={handleAddInstruction} className="add-btn">+ Add</button>
                </div>
                {instructions.map((instruction, index) => (
                    <div key={index} className="dynamic-input-row">
                        <input
                            type="text"
                            value={instruction}
                            onChange={(e) => handleInstructionChange(index, e.target.value)}
                            placeholder={`Step ${index + 1}`}
                            required
                        />
                        {instructions.length > 1 && (
                            <button type="button" onClick={() => handleRemoveInstruction(index)} className="remove-btn">
                                <span className="material-icons">delete</span>
                            </button>
                        )}
                    </div>
                ))}

                <button type="submit" style={{ marginTop: '20px' }}>Create</button>
            </form>
        </div>
    );
}