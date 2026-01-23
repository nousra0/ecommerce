import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../store/cartSlice";
import { openDrawer } from "../store/uiSlice";
import { selectCartItems } from "../store/cartSlice";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const [added, setAdded] = useState(false);

  const cartItem = cartItems.find((i) => i.id === product.id);
  const inCart = cartItem?.quantity ?? 0;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    dispatch(addItem(product));
    dispatch(openDrawer());
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const hasDiscount = product.discount != null;

  return (
    <article className="product-card card-theme h-100 d-flex flex-column">
      {hasDiscount && (
        <span
          className="product-card__discount"
          aria-label={`${product.discount}% off`}
        >
          −{product.discount}%
        </span>
      )}
      {inCart > 0 && (
        <span className="product-card__count" aria-label={`${inCart} in cart`}>
          ×{inCart}
        </span>
      )}
      <Link
        to={`/product/${product.id}`}
        className="img-product-wrap product-card__img-link"
        style={{ height: "220px" }}
      >
        <img
          src={product.image}
          className="img-product w-100 h-100"
          alt={product.name}
        />
      </Link>
      <div className="product-card__body d-flex flex-column flex-grow-1 p-3 p-md-4">
        <span className="badge-theme mb-2 align-self-start">
          {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
        </span>
        <h3 className="product-card__title">
          <Link to={`/product/${product.id}`} className="product-card__title-link">
            {product.name}
          </Link>
        </h3>
        <div className="product-card__meta d-flex justify-content-between align-items-center mt-auto pt-2">
          <span className="product-card__prices">
            {product.originalPrice != null ? (
              <>
                <span className="product-card__price-old">
                  ${product.originalPrice.toFixed(2)}
                </span>
                <span className="product-card__price">
                  ${product.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="product-card__price">
                ${product.price.toFixed(2)}
              </span>
            )}
          </span>
          <span className="badge-rating px-2 py-1">★ {product.rating}</span>
        </div>
        <button
          className="btn-theme btn-theme-primary product-card__btn mt-3"
          onClick={handleAdd}
          disabled={!product.inStock}
        >
          {added ? "Added ✓" : "Add to Cart"}
        </button>
      </div>
    </article>
  );
}
