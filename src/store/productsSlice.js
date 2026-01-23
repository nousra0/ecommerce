import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE = "https://dummyjson.com";

function mapProduct(p) {
  const hasDiscount = p.discountPercentage != null && p.discountPercentage > 0;
  return {
    id: p.id,
    name: p.title,
    price: p.price,
    originalPrice: hasDiscount
      ? Math.round((p.price / (1 - p.discountPercentage / 100)) * 100) / 100
      : undefined,
    discount: hasDiscount ? Math.round(p.discountPercentage) : undefined,
    category: p.category || "other",
    rating: p.rating ?? 0,
    image: p.thumbnail || p.images?.[0] || "",
    inStock: (p.stock ?? 0) > 0,
    // Extended API fields
    availabilityStatus: p.availabilityStatus ?? (p.stock > 0 ? "In Stock" : "Out of Stock"),
    brand: p.brand || undefined,
    description: p.description || undefined,
    dimensions: p.dimensions ? { width: p.dimensions.width, height: p.dimensions.height, depth: p.dimensions.depth } : undefined,
    images: Array.isArray(p.images) ? p.images : [],
    meta: p.meta ? { createdAt: p.meta.createdAt, updatedAt: p.meta.updatedAt } : undefined,
    minimumOrderQuantity: p.minimumOrderQuantity ?? undefined,
    returnPolicy: p.returnPolicy || undefined,
    reviews: Array.isArray(p.reviews) ? p.reviews : [],
    shippingInformation: p.shippingInformation || undefined,
    sku: p.sku || undefined,
    stock: p.stock ?? undefined,
    tags: Array.isArray(p.tags) ? p.tags : [],
    warrantyInformation: p.warrantyInformation || undefined,
    weight: p.weight != null ? p.weight : undefined,
  };
}

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/products?limit=50`);
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      const items = (data.products || []).map(mapProduct);
      const categories = [
        "All",
        ...[...new Set(items.map((i) => i.category))].sort((a, b) =>
          a.localeCompare(b)
        ),
      ];
      return { items, categories };
    } catch (err) {
      return rejectWithValue(err.message || "Network error");
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`);
      if (!res.ok) throw new Error("Product not found");
      const data = await res.json();
      return mapProduct(data);
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load product");
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    categories: ["All"],
    loading: false,
    error: null,
    currentProduct: null,
    currentProductLoading: false,
    currentProductError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.items = action.payload.items;
        state.categories = action.payload.categories;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load products";
      })
      .addCase(fetchProductById.pending, (state) => {
        state.currentProductLoading = true;
        state.currentProductError = null;
        state.currentProduct = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.currentProductLoading = false;
        state.currentProductError = null;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.currentProductLoading = false;
        state.currentProductError = action.payload || "Failed to load product";
        state.currentProduct = null;
      });
  },
});

export default productsSlice.reducer;
export const selectProducts = (state) => state.products.items;
export const selectCategories = (state) => state.products.categories;
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductsError = (state) => state.products.error;
export const selectCurrentProduct = (state) => state.products.currentProduct;
export const selectCurrentProductLoading = (state) => state.products.currentProductLoading;
export const selectCurrentProductError = (state) => state.products.currentProductError;
