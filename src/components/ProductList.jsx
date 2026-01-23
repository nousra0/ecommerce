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

const PER_PAGE = 9;

export default function ProductList() {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const categories = useSelector(selectCategories);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);

  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const handleResetFilters = () => {
    setCategory("All");
    setSortBy("default");
    setQuery("");
  };

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    setPage(1);
  }, [category, sortBy, query]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

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

  const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / PER_PAGE));
  const paginatedList = useMemo(
    () =>
      filteredAndSorted.slice((page - 1) * PER_PAGE, page * PER_PAGE),
    [filteredAndSorted, page]
  );

  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = [1];
    if (page > 3) pages.push("…");
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) pages.push(i);
    }
    if (page < totalPages - 2) pages.push("…");
    if (totalPages > 1) pages.push(totalPages);
    return pages;
  };

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
        {paginatedList.map((product) => (
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
      {totalPages > 1 && (
        <nav className="pagination" aria-label="Product pagination">
          <button
            type="button"
            className="pagination__btn pagination__btn--prev"
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
            aria-label="Previous page"
          >
            ‹ Previous
          </button>
          <div className="pagination__pages">
            {getPageNumbers().map((n, i) =>
              n === "…" ? (
                <span key={`ellipsis-${i}`} className="pagination__ellipsis" aria-hidden="true">
                  …
                </span>
              ) : (
                <button
                  key={n}
                  type="button"
                  className={`pagination__page ${n === page ? "pagination__page--current" : ""}`}
                  onClick={() => setPage(n)}
                  aria-label={`Page ${n}`}
                  aria-current={n === page ? "page" : undefined}
                >
                  {n}
                </button>
              )
            )}
          </div>
          <button
            type="button"
            className="pagination__btn pagination__btn--next"
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages}
            aria-label="Next page"
          >
            Next ›
          </button>
        </nav>
      )}
    </div>
  );
}
