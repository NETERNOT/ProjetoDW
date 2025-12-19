function FilterTab({ tags, filters, onFilterChange, onClear }) {
    return (
        <div
            className="filterTab"
        >
            <div className="searchBar">
                <span className="material-icons">search</span>
                <input type="text" placeholder="Search..."
                    value={filters.query}
                    onChange={(e) => onFilterChange('query', e.target.value)}
                ></input>
            </div>
            <div className="filterBar">
                <label className="filterLabel">
                    <span className="material-icons">filter_alt</span>
                    <span>Filters</span>
                </label>
                <select id="tags"
                    value={filters.tag}
                    onChange={(e) => onFilterChange('tag', e.target.value)}>
                    <option value="" disabled defaultValue>Tags</option>
                    {tags.map((tag, index) => (
                        <option key={index} value={tag}>{tag}</option>
                    ))}
                </select>
                <div className="cookingTime">
                    <label>Cooking Time: </label>
                    <input type="number" min="0" placeholder="Min"
                        value={filters.minTime}
                        onChange={(e) => onFilterChange('minTime', e.target.value)}></input>
                    -
                    <input type="number" min="0" placeholder="Max"
                        value={filters.maxTime}
                        onChange={(e) => onFilterChange('maxTime', e.target.value)}></input>
                </div>
                <div className="servings">
                    <label>Servings: </label>
                    <input type="number" min="0" placeholder="Min"
                        value={filters.minServings}
                        onChange={(e) => onFilterChange('minServings', e.target.value)}></input>
                    -
                    <input type="number" min="0" placeholder="Max"
                        value={filters.maxServings}
                        onChange={(e) => onFilterChange('maxServings', e.target.value)}></input>
                </div>
                <button className={`clearButton ${Object.values(filters).some(f => f !== "") ? "" : "hidden"}`} onClick={onClear}>
                    <span className="material-icons">close</span>
                    <span>Clear all</span>
                </button>
            </div>

        </div>
    );
}