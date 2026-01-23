import { useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function generateOrderId() {
  const now = Date.now().toString(36).toUpperCase();
  const r = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SH-${now}-${r}`;
}

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { amount, totalItems, orderId: passedOrderId } = location.state || {};

  const orderId = useMemo(
    () => passedOrderId || generateOrderId(),
    [passedOrderId]
  );

  useEffect(() => {
    if (location.state?.amount == null) {
      navigate("/", { replace: true });
    }
  }, [location.state?.amount, navigate]);

  if (location.state?.amount == null) {
    return null;
  }

  return (
    <div className="order-success">
      <div className="order-success__deco order-success__deco--tl" aria-hidden="true" />
      <div className="order-success__deco order-success__deco--br" aria-hidden="true" />
      <div className="order-success__confetti" aria-hidden="true" />

      <div className="order-success__inner">
        <div className="order-success__icon-wrap">
          <div className="order-success__circle">
            <svg
              className="order-success__check"
              viewBox="0 0 52 52"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                className="order-success__check-path"
                d="M14 27l8 8 16-18"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <span className="order-success__badge">Payment successful</span>
        <h1 className="order-success__title">Thank you for your order</h1>
        <p className="order-success__lead">
          Your payment was successful. We&apos;ve received your order and will get it ready for you.
        </p>

        <div className="order-success__card">
          <div className="order-success__card-row">
            <span className="order-success__card-label">Order ID</span>
            <span className="order-success__card-value order-success__card-value--id">{orderId}</span>
          </div>
          {amount != null && (
            <div className="order-success__card-row">
              <span className="order-success__card-label">Amount paid</span>
              <span className="order-success__card-value">${Number(amount).toFixed(2)}</span>
            </div>
          )}
          {totalItems != null && totalItems > 0 && (
            <div className="order-success__card-row">
              <span className="order-success__card-label">Items</span>
              <span className="order-success__card-value">{totalItems}</span>
            </div>
          )}
        </div>

        <p className="order-success__note">
          A confirmation email has been sent to your inbox. You can also find this order in your account.
        </p>

        <div className="order-success__actions">
          <Link to="/" className="btn-theme btn-theme-primary order-success__btn">
            Continue shopping
          </Link>
          <Link to="/" className="order-success__link">Back to home</Link>
        </div>
      </div>
    </div>
  );
}
