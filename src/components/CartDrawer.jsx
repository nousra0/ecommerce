import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCartItems,
  selectCartCount,
  selectCartTotal,
  removeItem,
  updateQuantity,
} from "../store/cartSlice";
import { closeDrawer, selectIsDrawerOpen } from "../store/uiSlice";

export default function CartDrawer() {
  const dispatch = useDispatch();
  const cart = useSelector(selectCartItems);
  const cartCount = useSelector(selectCartCount);
  const cartTotal = useSelector(selectCartTotal);
  const isDrawerOpen = useSelector(selectIsDrawerOpen);

  return (
    <div
      className={`cart-drawer ${isDrawerOpen ? "cart-drawer--open" : ""} ${cart.length > 0 ? "cart-drawer--passthrough" : ""}`}
      aria-hidden={!isDrawerOpen}
    >
      <div
        className="cart-drawer__backdrop"
        onClick={cart.length === 0 ? () => dispatch(closeDrawer()) : undefined}
        aria-label={cart.length === 0 ? "Close cart" : undefined}
      />
      <aside className="cart-drawer__panel" role="dialog" aria-label="Cart">
        <div className="cart-drawer__head">
          <h2 className="cart-drawer__title">Cart</h2>
          <button
            type="button"
            className="cart-drawer__close"
            onClick={() => dispatch(closeDrawer())}
            aria-label="Close cart"
          >
            ×
          </button>
        </div>
        <div className="cart-drawer__body">
          {cart.length === 0 ? (
            <div className="cart-drawer__empty">
              <p>Your cart is empty.</p>
              <button
                type="button"
                className="btn-theme btn-theme-primary"
                onClick={() => dispatch(closeDrawer())}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="cart-drawer__list">
              {cart.map((item) => (
                <li key={item.id} className="cart-drawer__item">
                  <div className="cart-drawer__item-img">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="cart-drawer__item-info">
                    <span className="cart-drawer__item-name">{item.name}</span>
                    <span className="cart-drawer__item-meta">
                      ${item.price.toFixed(2)} × {item.quantity}
                    </span>
                    <div className="cart-drawer__item-actions">
                      <div className="cart-drawer__qty">
                        <button
                          type="button"
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
                        <span>{item.quantity}</span>
                        <button
                          type="button"
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
                      <button
                        type="button"
                        className="cart-drawer__remove"
                        onClick={() => dispatch(removeItem({ id: item.id }))}
                        aria-label="Remove"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="cart-drawer__item-total">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {cart.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="cart-drawer__total">
              <span>
                Subtotal ({cartCount} {cartCount === 1 ? "item" : "items"})
              </span>
              <strong>${cartTotal.toFixed(2)}</strong>
            </div>
            <Link
              to="/cart"
              className="btn-theme btn-theme-primary cart-drawer__btn"
              onClick={() => dispatch(closeDrawer())}
            >
              View full cart
            </Link>
            <Link
              to="/checkout"
              className="btn-theme btn-theme-outline cart-drawer__btn"
              onClick={() => dispatch(closeDrawer())}
            >
              Checkout
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
