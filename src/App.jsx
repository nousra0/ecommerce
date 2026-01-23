import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProductList from "./components/ProductList";
import ProductDetails from "./components/ProductDetails";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import OrderSuccess from "./components/OrderSuccess";
import CartDrawer from "./components/CartDrawer";
import "./App.css";

function AppInner() {
  const location = useLocation();
  const isCheckout = location.pathname === "/checkout";

  return (
    <>
      <Navbar />
      <main className={isCheckout ? "main--checkout" : "py-3"}>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
        </Routes>
      </main>
      <CartDrawer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}

export default App;
