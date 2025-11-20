// src/features/cart/cartSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// ======================
// ADD TO CART
// ======================
export const addToCartAPI = createAsyncThunk(
  "cart/addToCartAPI",
  async (product, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/cart/add", {
        productId: product._id,
        quantity: 1,
      });
      // backend se pura cart object aa raha hai
      return res.data.cart;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add to cart"
      );
    }
  }
);

// ======================
// GET CART
// ======================
export const getCartAPI = createAsyncThunk(
  "cart/getCartAPI",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/cart/all");
      // backend se pura cart object aa raha hai
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch cart"
      );
    }
  }
);

// ======================
// SLICE
// ======================
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],       // [{_id, quantity, product: {...}}]
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // ---------- ADD TO CART ----------
      .addCase(addToCartAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCartAPI.fulfilled, (state, action) => {
        state.loading = false;
        const newItems = action.payload.items || [];

        // Merge newItems with existing state
        newItems.forEach((addedItem) => {
          const existing = state.items.find((i) => i._id === addedItem._id);
          if (existing) {
            existing.quantity = addedItem.quantity;
            existing.product = addedItem.product;
          } else {
            state.items.push(addedItem);
          }
        });
      })
      .addCase(addToCartAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---------- GET CART ----------
      .addCase(getCartAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCartAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
      })
      .addCase(getCartAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
