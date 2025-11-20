import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance"; // ✅ import instance

// Async thunk using Axios instance
export const fetchProducts = createAsyncThunk("products/fetch", async () => {
  try {
    console.log("📡 Fetching products...");
    const res = await api.get("/products/all"); // ✅ simplified call
    console.log("✅ API Response:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Fetch error:", err.message);
    throw err;
  }
});

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default productsSlice.reducer;
