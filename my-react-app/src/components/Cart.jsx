// src/components/Cart.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getCartAPI } from "../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import axiosInstance from "../api/axiosInstance";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Cart Items
  const cartItems = Array.isArray(useSelector((state) => state.cart?.items))
    ? useSelector((state) => state.cart.items)
    : [];

  // Load Cart on Mount
  useEffect(() => {
    dispatch(getCartAPI());
  }, [dispatch]);

  // Clear Cart
  const clearCart = async () => {
    try {
      await axiosInstance.delete("/cart/clear");
      dispatch(getCartAPI());
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  // Increase Quantity
  const increaseQuantity = async (productId) => {
    try {
      await axiosInstance.put(`/cart/increase/${productId}`);
      dispatch(getCartAPI());
    } catch (error) {
      console.error("Increase Error:", error);
    }
  };

  // Decrease Quantity
  const decreaseQuantity = async (productId) => {
    try {
      await axiosInstance.put(`/cart/decrease/${productId}`);
      dispatch(getCartAPI());
    } catch (error) {
      console.error("Decrease Error:", error);
    }
  };

  // Remove Item
  const removeFromCart = async (productId) => {
    try {
      await axiosInstance.delete(`/cart/remove/${productId}`);
      dispatch(getCartAPI());
    } catch (error) {
      console.error("Remove Error:", error);
    }
  };

  // Product Safe Access
  const getProduct = (item) =>
    item.product || {
      title: "No title",
      price: 0,
      description: "No description",
      imageUrl: "/placeholder.png",
    };

  // Calculate Total
  const totalPrice = cartItems.reduce((total, item) => {
    const product = getProduct(item);
    const qty = item.quantity || 1;
    return total + product.price * qty;
  }, 0);

  // Empty Cart
  if (!cartItems.length) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <h2 className="text-xl">🛒 Your Cart is Empty</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center bg-gray-50 min-h-screen">
      <div className="grid sm:grid-cols-1 md:grid-cols-4 gap-4 items-center p-6 shadow-lg bg-white rounded-lg w-full mx-4 my-10">
        {cartItems.map((item) => {
          const product = getProduct(item);

          return (
            <div
              key={item._id}
              className="relative flex flex-col items-center justify-center w-full h-full shadow rounded-lg border p-5"
            >
              {/* Remove Button (FIXED!) */}
              <button
                onClick={() => removeFromCart(product._id)}
                className="absolute top-2 right-2 bg-red-500 text-white w-7 h-7 flex items-center justify-center rounded-full hover:bg-red-600"
              >
                ×
              </button>

              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-[200px] h-[200px] object-contain rounded"
              />

              <div className="flex-1 px-4 text-center">
                <h3 className="font-semibold text-gray-800">{product.title}</h3>
                <p className="text-gray-600">{product.description}</p>
                <p className="text-gray-600 font-semibold">
                  ${product.price.toFixed(2)}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 flex items-center gap-1 text-sm"
                >
                  <FaEye /> View
                </button>

                <button
                  className="w-6 h-6 bg-yellow-500 text-white rounded"
                  onClick={() => decreaseQuantity(product._id)}
                >
                  -
                </button>

                <span className="text-gray-700 font-medium">
                  {item.quantity || 1}
                </span>

                <button
                  className="w-6 h-6 bg-green-500 text-white rounded"
                  onClick={() => increaseQuantity(product._id)}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total + Buttons */}
      <div className="flex flex-col items-center space-y-4 mb-10">
        <div className="flex items-center gap-2 text-2xl font-semibold text-gray-800">
          <span>Total:</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>

        <div className="flex gap-4">
          <button
            onClick={clearCart}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md text-sm"
          >
            Clear Cart
          </button>

          <button
            onClick={() => navigate("/checkout")}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md text-sm"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
