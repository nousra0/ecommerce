export default function Filters({
  categories,
  category,
  setCategory,
  sortBy,
  setSortBy,
  query,
  setQuery,
  onReset,
}) {
  const hasActiveFilters =
    category !== "All" || sortBy !== "default" || query !== "";

  return (
    <div className="filters">
      <div className="filters__search">
        <label className="filters__label" htmlFor="filter-search">
          Search
        </label>
        <input
          id="filter-search"
          type="search"
          className="input-theme"
          placeholder="Product name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="filters__field">
        <label className="filters__label" htmlFor="filter-cat">
          Category
        </label>
        <select
          id="filter-cat"
          className="select-theme"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {(categories || ["All"]).map((c) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <div className="filters__field">
        <label className="filters__label" htmlFor="filter-sort">
          Sort by
        </label>
        <select
          id="filter-sort"
          className="select-theme"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="default">Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Rating</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>
      {hasActiveFilters && onReset && (
        <div className="filters__reset">
          <button
            type="button"
            className="btn-theme btn-theme-ghost filters__reset-btn"
            onClick={onReset}
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
}
