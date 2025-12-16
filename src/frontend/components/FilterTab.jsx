function FilterTab({ tags }) {
    return (
        <div
            className="filterTab"
        >
            <div className="searchBar">
                <span className="material-icons">search</span>
                <input type="text" placeholder="Search.."></input>
            </div>
            <div className="filterBar">
                <label className="filterLabel">
                    <span className="material-icons">filter_alt</span>
                    <span>Filters</span>
                </label>
                <select id="tags" data-placeholder="Tags">
                    {tags.map((tag, index) => (
                        <option key={index} value={tag}>{tag}</option>
                    ))}
                </select>
                <div className="cookingTime">
                    <label>Cooking Time:</label>
                    <input type="number" min="0" placeholder="Min"></input>
                    <input type="number" max="0" placeholder="Max"></input>
                </div>
                <div className="servings">
                    <label>Servings:</label>
                    <input type="number" min="0" placeholder="Min"></input>
                    <input type="number" max="0" placeholder="Max"></input>
                </div>
                <button className="applyButton">
                    <span className="material-icons">close</span>
                    <span>Clear</span>
                </button>
            </div>

        </div>
    );
}