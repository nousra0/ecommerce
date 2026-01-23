# E‑commerce (React + Vite)

A full‑stack-style e‑commerce frontend built with React, Redux Toolkit, and React Router. It fetches products from the [DummyJSON](https://dummyjson.com) API and implements a complete shopping flow: browse, filter, product details, cart, checkout, and order confirmation.

---

## Tech stack

- **React 19** + **Vite 7**
- **Redux Toolkit** – products, cart, and UI (cart drawer)
- **React Router v7** – routing
- **Bootstrap 5** – layout utilities
- **react-credit-cards-2** – checkout card preview
- **DummyJSON** – product and single-product APIs

---

## What we built

### 1. **Product catalog**

- **Product list** (`ProductList`): Fetches up to 50 products from `GET /products?limit=50`, shows them in a responsive grid.
- **Product cards** (`ProductCard`): Each card shows:
  - Image (clickable → product page)
  - Category badge
  - Title (clickable → product page)
  - Price (with original price and discount badge when on sale)
  - Rating
  - “Add to Cart” (opens cart drawer and shows in-cart count when relevant)

Products are normalized from the API into a shared shape (id, name, price, originalPrice, discount, category, rating, image, inStock, plus extended fields used on the product page).

---

### 2. **Filters**

- **Search** – by product name (client-side)
- **Category** – dropdown from API categories plus “All”
- **Sort** – Default, Price (low/high), Rating, Name A–Z
- **Reset filters** – one click sets Search = `""`, Category = `"All"`, Sort = `"default"`. The reset button sits in the same row as the other filter fields and only appears when at least one filter is active.

Filtering and sorting are done in `ProductList` with `useMemo` over the Redux product list.

---

### 3. **Product details page** (`/product/:id`)

- **Data source**: Uses the product from the catalog when available; otherwise fetches `GET /products/:id` and stores it in `currentProduct`.
- **Layout**:
  - **Gallery**: Main image, discount badge, thumbnails when there are multiple images.
  - **Info**: Category, title, brand, price, rating, description, “Add to Cart”.
- **Full API fields** (shown when present):
  - **Specifications**: SKU, availability, stock, dimensions, weight, min. order, tags.
  - **Policies**: Shipping, returns, warranty in separate cards.
  - **Reviews**: Shown in a **horizontal slider** with:
    - Scroll-snap, prev/next arrows, and dots.
    - For 2–3 reviews: a single dot; for 4+ reviews: one dot per review.
  - **Meta**: Created/updated dates and image count.

---

### 4. **Cart**

- **Cart drawer** (`CartDrawer`): Slide-in from the right when adding from list or product page. Shows items, quantity controls, remove, and subtotal. Links to Cart and Checkout.
- **Cart page** (`/cart`): Full cart with quantity controls, remove, clear, summary, and link to Checkout.
- **Redux** (`cartSlice`): `addItem`, `removeItem`, `updateQuantity`, `clearCart`. Selectors: `selectCartItems`, `selectCartCount`, `selectCartTotal`.

---

### 5. **Checkout** (`/checkout`)

- Empty cart: message and link to products.
- **Payment form**:
  - Live card preview (`react-credit-cards-2`) for number, name, expiry, CVC.
  - Validation for number length, expiry `MM/YY`, CVC.
- On valid submit: `clearCart`, navigate to `/order-success` with `amount` and `totalItems` in `location.state`.

---

### 6. **Order success** (`/order-success`)

- Reads `amount` and `totalItems` from `location.state`.
- Shows a success message, order summary, and links to go back to the shop or home.

---

### 7. **UI and layout**

- **Navbar**: Sticky; links (Home, Cart with count); cart icon opens the drawer.
- **Redux `uiSlice`**: `isDrawerOpen`, `openDrawer`, `closeDrawer`.
- **Theme** (`index.css` + `App.css`): Warm editorial look – Fraunces (headings), Outfit (body), terracotta accent (`#c75b3a`), light background, subtle texture. Reusable classes: `card-theme`, `btn-theme`, `input-theme`, `select-theme`, `badge-theme`, etc.

---

## Redux store

| Slice       | Role                                                                 |
|------------|----------------------------------------------------------------------|
| `products` | `items`, `categories`, `loading`, `error`; `currentProduct`, `currentProductLoading`, `currentProductError`. Thunks: `fetchProducts`, `fetchProductById`. |
| `cart`     | `items` (product + `quantity`). Actions: `addItem`, `removeItem`, `updateQuantity`, `clearCart`. |
| `ui`       | `isDrawerOpen`. Actions: `openDrawer`, `closeDrawer`.               |

---

## Routes

| Path              | Component      | Purpose                          |
|-------------------|----------------|----------------------------------|
| `/`               | `ProductList`  | Catalog + filters + grid         |
| `/product/:id`    | `ProductDetails` | Full product page + gallery + reviews slider |
| `/cart`           | `Cart`         | Cart with summary                |
| `/checkout`       | `Checkout`     | Payment form + card preview      |
| `/order-success`  | `OrderSuccess` | Order confirmation                |

---

## Run the project

```bash
npm install
npm run dev
```

Then open the URL shown by Vite (e.g. `http://localhost:5173`).

- **Build**: `npm run build`
- **Preview build**: `npm run preview`
- **Lint**: `npm run lint`

---

## Summary

We built an e‑commerce frontend that:

1. Loads and normalizes products from DummyJSON and supports single-product fetch.
2. Lets users filter (search, category, sort) and reset filters in one click.
3. Shows compact product cards that link to a detailed product page.
4. On the product page, shows all API fields (specs, policies, meta) and reviews in a slider (arrows + dots, with one dot when there are ≤3 reviews).
5. Implements cart in Redux plus a slide-out drawer and a full cart page.
6. Adds a checkout with a live card preview and basic validation, then an order-success view.

State is centralized in Redux; routing and UI follow a warm, editorial-style theme.
