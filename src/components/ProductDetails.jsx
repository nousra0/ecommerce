import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../store/cartSlice";
import { openDrawer } from "../store/uiSlice";
import {
  selectProducts,
  selectCurrentProduct,
  selectCurrentProductLoading,
  selectCurrentProductError,
  fetchProductById,
} from "../store/productsSlice";

function formatDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState(0);
  const [added, setAdded] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const reviewTrackRef = useRef(null);

  const products = useSelector(selectProducts);
  const currentProduct = useSelector(selectCurrentProduct);
  const loading = useSelector(selectCurrentProductLoading);
  const error = useSelector(selectCurrentProductError);

  const product =
    products.find((p) => p.id === Number(id)) || currentProduct;

  useEffect(() => {
    if (id && !products.find((p) => p.id === Number(id))) {
      dispatch(fetchProductById(id));
    }
  }, [id, dispatch, products]);

  useEffect(() => {
    setSelectedImage(0);
    setReviewIndex(0);
    if (reviewTrackRef.current) reviewTrackRef.current.scrollLeft = 0;
  }, [id]);

  const getCardStep = () => {
    const track = reviewTrackRef.current;
    if (!track?.children?.length) return 336;
    const card = track.children[0];
    const gap = 16;
    return card.offsetWidth + gap;
  };

  const handleReviewScroll = () => {
    const track = reviewTrackRef.current;
    if (!track) return;
    const step = getCardStep();
    const i = Math.round(track.scrollLeft / step);
    const len = product?.reviews?.length || 1;
    setReviewIndex(Math.max(0, Math.min(i, len - 1)));
  };

  const goToReview = (i) => {
    reviewTrackRef.current?.scrollTo({ left: i * getCardStep(), behavior: "smooth" });
  };

  const goPrevReview = () => {
    reviewTrackRef.current?.scrollBy({ left: -getCardStep(), behavior: "smooth" });
  };

  const goNextReview = () => {
    reviewTrackRef.current?.scrollBy({ left: getCardStep(), behavior: "smooth" });
  };

  const handleAdd = () => {
    if (!product?.inStock) return;
    dispatch(addItem(product));
    dispatch(openDrawer());
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const images = product?.images?.length
    ? product.images
    : product?.image
      ? [product.image]
      : [];
  const mainImage = images[selectedImage] || product?.image || "";
  const dim = product?.dimensions;
  const hasDimensions =
    dim && (dim.width != null || dim.height != null || dim.depth != null);

  if (loading && !product) {
    return (
      <div className="product-detail">
        <div className="product-detail__loading">
          <div className="product-detail__spinner" aria-hidden="true" />
          <p className="product-detail__loading-text">Loading product…</p>
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="product-detail container--shop">
        <div className="product-detail__error">
          <p className="product-detail__error-text">{error}</p>
          <Link to="/" className="btn-theme btn-theme-primary">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="product-detail">
      <div className="product-detail__deco product-detail__deco--top" aria-hidden="true" />

      <div className="container--shop product-detail__container">
        <Link to="/" className="product-detail__back">
          <span className="product-detail__back-arrow" aria-hidden="true">←</span>
          Back to shop
        </Link>

        <div className="product-detail__hero">
          {/* Gallery */}
          <div className="product-detail__gallery">
            <div className="product-detail__main-wrap">
              <img
                src={mainImage}
                alt={product.name}
                className="product-detail__main-img"
              />
              {product.discount != null && (
                <span className="product-detail__badge product-detail__badge--discount">
                  −{product.discount}% off
                </span>
              )}
            </div>
            {images.length > 1 && (
              <div className="product-detail__thumbs">
                {images.map((src, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`product-detail__thumb ${i === selectedImage ? "product-detail__thumb--active" : ""}`}
                    onClick={() => setSelectedImage(i)}
                    aria-label={`View image ${i + 1}`}
                  >
                    <img src={src} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="product-detail__info">
            <span className="badge-theme product-detail__category">
              {product.category?.charAt(0).toUpperCase() + product.category?.slice(1) || "Product"}
            </span>
            <h1 className="product-detail__title">{product.name}</h1>
            {product.brand && (
              <p className="product-detail__brand">by {product.brand}</p>
            )}

            <div className="product-detail__price-row">
              <span className="product-detail__price">
                ${product.price?.toFixed(2)}
              </span>
              {product.originalPrice != null && (
                <span className="product-detail__price-old">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
              <span className="badge-rating product-detail__rating">
                ★ {product.rating}
              </span>
            </div>

            {product.description && (
              <div className="product-detail__description">
                <h3 className="product-detail__section-title">About</h3>
                <p>{product.description}</p>
              </div>
            )}

            <div className="product-detail__actions">
              <button
                className="btn-theme btn-theme-primary product-detail__add"
                onClick={handleAdd}
                disabled={!product.inStock}
              >
                {added ? "Added ✓" : "Add to Cart"}
              </button>
              {!product.inStock && (
                <span className="product-detail__out">Out of stock</span>
              )}
            </div>
          </div>
        </div>

        {/* Specifications */}
        {(product.sku || product.availabilityStatus || product.stock != null || hasDimensions || product.weight != null || (product.minimumOrderQuantity != null && product.minimumOrderQuantity > 1) || (product.tags?.length > 0)) && (
        <section className="product-detail__specs" aria-labelledby="specs-heading">
          <h2 id="specs-heading" className="product-detail__section-head">
            <span className="product-detail__section-head-line" />
            Specifications
            <span className="product-detail__section-head-line" />
          </h2>
          <div className="product-detail__spec-grid">
            {product.sku && (
              <div className="product-detail__spec-card">
                <span className="product-detail__spec-label">SKU</span>
                <span className="product-detail__spec-value">{product.sku}</span>
              </div>
            )}
            {product.availabilityStatus && (
              <div className="product-detail__spec-card">
                <span className="product-detail__spec-label">Availability</span>
                <span className="product-detail__spec-value product-detail__spec-value--stock">
                  {product.availabilityStatus}
                </span>
              </div>
            )}
            {product.stock != null && (
              <div className="product-detail__spec-card">
                <span className="product-detail__spec-label">Stock</span>
                <span className="product-detail__spec-value">{product.stock} units</span>
              </div>
            )}
            {hasDimensions && (
              <div className="product-detail__spec-card">
                <span className="product-detail__spec-label">Dimensions</span>
                <span className="product-detail__spec-value">
                  {[dim.width, dim.height, dim.depth].filter((n) => n != null).join(" × ")} cm
                </span>
              </div>
            )}
            {product.weight != null && (
              <div className="product-detail__spec-card">
                <span className="product-detail__spec-label">Weight</span>
                <span className="product-detail__spec-value">{product.weight} kg</span>
              </div>
            )}
            {product.minimumOrderQuantity != null && product.minimumOrderQuantity > 1 && (
              <div className="product-detail__spec-card">
                <span className="product-detail__spec-label">Min. order</span>
                <span className="product-detail__spec-value">{product.minimumOrderQuantity}</span>
              </div>
            )}
          </div>
          {product.tags?.length > 0 && (
            <div className="product-detail__tags">
              {product.tags.map((t) => (
                <span key={t} className="product-detail__tag">{t}</span>
              ))}
            </div>
          )}
        </section>
        )}

        {/* Policies */}
        {(product.shippingInformation || product.returnPolicy || product.warrantyInformation) && (
        <section className="product-detail__policies" aria-labelledby="policies-heading">
          <h2 id="policies-heading" className="product-detail__section-head">
            <span className="product-detail__section-head-line" />
            Policies
            <span className="product-detail__section-head-line" />
          </h2>
          <div className="product-detail__policy-grid">
            {product.shippingInformation && (
              <div className="product-detail__policy-card">
                <span className="product-detail__policy-icon" aria-hidden="true">↠</span>
                <h4 className="product-detail__policy-title">Shipping</h4>
                <p className="product-detail__policy-text">{product.shippingInformation}</p>
              </div>
            )}
            {product.returnPolicy && (
              <div className="product-detail__policy-card">
                <span className="product-detail__policy-icon" aria-hidden="true">↺</span>
                <h4 className="product-detail__policy-title">Returns</h4>
                <p className="product-detail__policy-text">{product.returnPolicy}</p>
              </div>
            )}
            {product.warrantyInformation && (
              <div className="product-detail__policy-card">
                <span className="product-detail__policy-icon" aria-hidden="true">◉</span>
                <h4 className="product-detail__policy-title">Warranty</h4>
                <p className="product-detail__policy-text">{product.warrantyInformation}</p>
              </div>
            )}
          </div>
        </section>
        )}

        {/* Reviews */}
        {product.reviews?.length > 0 && (
          <section className="product-detail__reviews" aria-labelledby="reviews-heading">
            <h2 id="reviews-heading" className="product-detail__section-head">
              <span className="product-detail__section-head-line" />
              Reviews ({product.reviews.length})
              <span className="product-detail__section-head-line" />
            </h2>
            <div className="product-detail__review-slider">
              {product.reviews.length > 1 && (
                <button
                  type="button"
                  className="product-detail__review-arrow product-detail__review-arrow--prev"
                  onClick={goPrevReview}
                  disabled={reviewIndex === 0}
                  aria-label="Previous review"
                >
                  ‹
                </button>
              )}
              <div
                className="product-detail__review-track"
                ref={reviewTrackRef}
                onScroll={handleReviewScroll}
                role="region"
                aria-label="Reviews carousel"
              >
                {product.reviews.map((r, i) => (
                  <blockquote key={i} className="product-detail__review-card">
                    <span className="product-detail__review-stars">
                      {"★".repeat(r.rating || 0)}{"☆".repeat(5 - (r.rating || 0))}
                    </span>
                    <p className="product-detail__review-text">"{r.comment}"</p>
                    {r.date && (
                      <footer className="product-detail__review-date">
                        {formatDate(r.date)}
                      </footer>
                    )}
                  </blockquote>
                ))}
              </div>
              {product.reviews.length > 1 && (
                <button
                  type="button"
                  className="product-detail__review-arrow product-detail__review-arrow--next"
                  onClick={goNextReview}
                  disabled={reviewIndex >= product.reviews.length - 1}
                  aria-label="Next review"
                >
                  ›
                </button>
              )}
            </div>
            {product.reviews.length > 1 && (
              <div className="product-detail__review-dots" role="group" aria-label="Review navigation">
                {Array.from(
                  { length: product.reviews.length <= 3 ? 1 : product.reviews.length },
                  (_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={product.reviews.length <= 3 ? "Reviews" : `Review ${i + 1}`}
                      className={`product-detail__review-dot ${(product.reviews.length <= 3) || (i === reviewIndex) ? "product-detail__review-dot--active" : ""}`}
                      onClick={() => goToReview(product.reviews.length <= 3 ? 0 : i)}
                    />
                  )
                )}
              </div>
            )}
          </section>
        )}

        {/* Meta */}
        {(product.meta?.createdAt || product.meta?.updatedAt) && (
          <div className="product-detail__meta">
            {product.meta.createdAt && (
              <span>Added {formatDate(product.meta.createdAt)}</span>
            )}
            {product.meta.createdAt && product.meta.updatedAt && " · "}
            {product.meta.updatedAt && (
              <span>Updated {formatDate(product.meta.updatedAt)}</span>
            )}
          </div>
        )}

        {images.length > 1 && (
          <div className="product-detail__meta">
            <span>{images.length} product images</span>
          </div>
        )}
      </div>

      <div className="product-detail__deco product-detail__deco--bottom" aria-hidden="true" />
    </div>
  );
}
