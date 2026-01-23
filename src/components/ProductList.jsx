import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../store/productsSlice";
import {
  selectProducts,
  selectCategories,
  selectProductsLoading,
  selectProductsError,
} from "../store/productsSlice";
import ProductCard from "./ProductCard";
import Filters from "./Filters";

export default function ProductList() {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const categories = useSelector(selectCategories);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);

  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [query, setQuery] = useState("");

  const handleResetFilters = () => {
    setCategory("All");
    setSortBy("default");
    setQuery("");
  };

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredAndSorted = useMemo(() => {
    let list = products.filter((p) => {
      const matchCat = category === "All" || p.category === category;
      const matchQuery =
        !query || p.name.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQuery;
    });

    if (sortBy === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc")
      list = [...list].sort((a, b) => b.price - a.price);
    else if (sortBy === "rating")
      list = [...list].sort((a, b) => b.rating - a.rating);
    else if (sortBy === "name")
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }, [products, category, sortBy, query]);

  if (loading) {
    return (
      <div className="container container--shop">
        <header className="page-head">
          <h1 className="page-head__title">Products</h1>
          <p className="page-head__sub">Curated picks for you.</p>
        </header>
        <div className="empty-state">
          <p className="empty-state__text">Loading products…</p>
          <p className="empty-state__sub">Please wait.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container container--shop">
        <header className="page-head">
          <h1 className="page-head__title">Products</h1>
        </header>
        <div className="empty-state">
          <p className="empty-state__text">{error}</p>
          <p className="empty-state__sub">Check your connection and try again.</p>
          <button
            type="button"
            className="btn-theme btn-theme-primary mt-3"
            onClick={() => dispatch(fetchProducts())}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container container--shop">
      <header className="page-head">
        <h1 className="page-head__title">Products</h1>
        <p className="page-head__sub">Curated picks for you.</p>
      </header>
      <section className="filters-wrap">
        <Filters
          categories={categories}
          category={category}
          setCategory={setCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          query={query}
          setQuery={setQuery}
          onReset={handleResetFilters}
        />
      </section>
      <section className="product-grid" aria-label="Products">
        {filteredAndSorted.map((product) => (
          <div key={product.id} className="product-grid__col">
            <ProductCard product={product} />
          </div>
        ))}
      </section>
      {filteredAndSorted.length === 0 && (
        <div className="empty-state">
          <p className="empty-state__text">No products match your filters.</p>
          <p className="empty-state__sub">Try a different search or category.</p>
        </div>
      )}
    </div>
  );
}
