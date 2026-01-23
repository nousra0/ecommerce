import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectCartCount } from "../store/cartSlice";
import { openDrawer } from "../store/uiSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const cartCount = useSelector(selectCartCount);

  return (
    <header className="navbar-theme">
      <div className="navbar-theme__inner">
        <Link className="navbar-theme__brand" to="/">
          Shop
        </Link>
        <button
          className="navbar-theme__toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
        <nav className="navbar-theme__nav collapse" id="navbarNav">
          <Link className="navbar-theme__link" to="/">
            Products
          </Link>
          <button
            type="button"
            className="navbar-theme__link navbar-theme__link--cart navbar-theme__btn"
            onClick={() => dispatch(openDrawer())}
          >
            <span className="navbar-theme__cart-label">Cart</span>
            {cartCount > 0 && (
              <span className="navbar-theme__badge">{cartCount}</span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
