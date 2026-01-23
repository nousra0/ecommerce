import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import { selectCartItems, selectCartTotal, clearCart } from "../store/cartSlice";

export default function Checkout() {
  const dispatch = useDispatch();
  const cart = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("checkout-page");
    return () => document.body.classList.remove("checkout-page");
  }, []);

  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [focus, setFocus] = useState("");
  const [errors, setErrors] = useState({});

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <h2 className="cart-empty__title">Nothing to checkout</h2>
        <p className="cart-empty__text">Your cart is empty. Add items to proceed.</p>
        <Link to="/" className="btn-theme btn-theme-primary">Browse Products</Link>
      </div>
    );
  }

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Required";
    const digits = number.replace(/\D/g, "");
    if (digits.length < 13 || digits.length > 19) e.number = "Enter a valid card number";
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) e.expiry = "Use MM/YY";
    if (!/^\d{3,4}$/.test(cvc)) e.cvc = "3 or 4 digits";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    const paid = cartTotal;
    const items = cart.reduce((s, i) => s + i.quantity, 0);
    dispatch(clearCart());
    navigate("/order-success", { state: { amount: paid, totalItems: items } });
  };

  const formatNumber = (v) => {
    const d = v.replace(/\D/g, "").slice(0, 16);
    return d.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
  };

  const formatExpiry = (v) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    if (d.length >= 2) return d.slice(0, 2) + "/" + d.slice(2);
    return d;
  };

  return (
    <div className="checkout-payment">
      <div className="checkout-payment__deco checkout-payment__deco--tl" aria-hidden="true" />
      <div className="checkout-payment__deco checkout-payment__deco--br" aria-hidden="true" />

      <div className="checkout-payment__inner">
        <div className="checkout-payment__card-wrap">
          <Cards
            number={number}
            name={name}
            expiry={expiry}
            cvc={cvc}
            focused={focus}
          />
        </div>

        <form onSubmit={handleSubmit} className="checkout-payment__form">
          <h2 className="checkout-payment__form-title">Payment details</h2>

          <div className="checkout-payment__field">
            <label className="checkout-payment__label" htmlFor="payment-name">CARDHOLDER NAME</label>
            <input
              id="payment-name"
              name="name"
              type="text"
              className={`checkout-payment__input ${errors.name ? "checkout-payment__input--error" : ""}`}
              placeholder="John Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setFocus("name")}
              onBlur={() => setFocus("")}
              autoComplete="cc-name"
            />
            {errors.name && <span className="checkout-payment__error">{errors.name}</span>}
          </div>

          <div className="checkout-payment__field">
            <label className="checkout-payment__label" htmlFor="payment-number">CARD NUMBER</label>
            <input
              id="payment-number"
              name="number"
              type="text"
              className={`checkout-payment__input ${errors.number ? "checkout-payment__input--error" : ""}`}
              placeholder="4256 7890 5678 4532"
              value={number}
              onChange={(e) => setNumber(formatNumber(e.target.value))}
              onFocus={() => setFocus("number")}
              onBlur={() => setFocus("")}
              maxLength={19}
              autoComplete="cc-number"
            />
            {errors.number && <span className="checkout-payment__error">{errors.number}</span>}
          </div>

          <div className="checkout-payment__row">
            <div className="checkout-payment__field">
              <label className="checkout-payment__label" htmlFor="payment-expiry">EXPIRY</label>
              <input
                id="payment-expiry"
                name="expiry"
                type="text"
                className={`checkout-payment__input ${errors.expiry ? "checkout-payment__input--error" : ""}`}
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                onFocus={() => setFocus("expiry")}
                onBlur={() => setFocus("")}
                maxLength={5}
                autoComplete="cc-exp"
              />
              {errors.expiry && <span className="checkout-payment__error">{errors.expiry}</span>}
            </div>
            <div className="checkout-payment__field">
              <label className="checkout-payment__label" htmlFor="payment-cvc">CVC</label>
              <input
                id="payment-cvc"
                name="cvc"
                type="text"
                inputMode="numeric"
                className={`checkout-payment__input ${errors.cvc ? "checkout-payment__input--error" : ""}`}
                placeholder="345"
                value={cvc}
                onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                onFocus={() => setFocus("cvc")}
                onBlur={() => setFocus("")}
                maxLength={4}
                autoComplete="cc-csc"
              />
              {errors.cvc && <span className="checkout-payment__error">{errors.cvc}</span>}
            </div>
          </div>

          <p className="checkout-payment__amount">
            Payment amount: <strong>${cartTotal.toFixed(2)}</strong>
          </p>

          <button type="submit" className="checkout-payment__pay">
            PAY
          </button>

          <Link to="/cart" className="checkout-payment__back">Back to cart</Link>
        </form>
      </div>
    </div>
  );
}
