import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCartItems,
  selectCartTotal,
  removeItem,
  updateQuantity,
  clearCart,
} from "../store/cartSlice";

export default function Cart() {
  const dispatch = useDispatch();
  const cart = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty__icon" aria-hidden="true">
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="60"
              cy="60"
              r="54"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="4 4"
              opacity="0.35"
            />
            <path
              d="M42 48h36l-6 32H48l-6-32z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              opacity="0.5"
            />
            <circle cx="50" cy="86" r="4" fill="currentColor" opacity="0.4" />
            <circle cx="78" cy="86" r="4" fill="currentColor" opacity="0.4" />
          </svg>
        </div>
        <h2 className="cart-empty__title">Your cart is empty</h2>
        <p className="cart-empty__text">Add some products to get started.</p>
        <Link to="/" className="btn-theme btn-theme-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container container--shop cart-page">
      <div className="cart-page__head">
        <h1 className="cart-page__title">Your Cart</h1>
        <button
          type="button"
          className="btn-theme btn-theme-ghost cart-page__clear"
          onClick={() => dispatch(clearCart())}
        >
          Clear Cart
        </button>
      </div>
      <div className="cart-page__grid">
        <div className="cart-page__items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item card-theme">
              <div className="cart-item__img-wrap">
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item__img"
                />
              </div>
              <div className="cart-item__info">
                <h3 className="cart-item__name">{item.name}</h3>
                <span className="cart-item__cat">
                  {item.category?.charAt(0)?.toUpperCase()}
                  {item.category?.slice(1)}
                </span>
                <span className="cart-item__unit">
                  ${item.price.toFixed(2)} each
                </span>
              </div>
              <div className="cart-item__qty">
                <button
                  type="button"
                  className="cart-item__qty-btn"
                  onClick={() =>
                    dispatch(
                      updateQuantity({
                        id: item.id,
                        quantity: item.quantity - 1,
                      })
                    )
                  }
                  aria-label="Decrease"
                >
                  −
                </button>
                <span className="cart-item__qty-num">{item.quantity}</span>
                <button
                  type="button"
                  className="cart-item__qty-btn"
                  onClick={() =>
                    dispatch(
                      updateQuantity({
                        id: item.id,
                        quantity: item.quantity + 1,
                      })
                    )
                  }
                  aria-label="Increase"
                >
                  +
                </button>
              </div>
              <div className="cart-item__total">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
              <button
                type="button"
                className="cart-item__remove"
                onClick={() => dispatch(removeItem({ id: item.id }))}
                aria-label="Remove from cart"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <aside className="cart-page__summary">
          <div className="cart-summary card-theme">
            <h3 className="cart-summary__title">Order Summary</h3>
            <div className="cart-summary__row">
              <span>Items ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="cart-summary__total">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <Link
              to="/checkout"
              className="btn-theme btn-theme-primary cart-summary__checkout"
            >
              Proceed to Checkout
            </Link>
            <Link
              to="/"
              className="btn-theme btn-theme-outline cart-summary__continue"
            >
              Continue Shopping
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
