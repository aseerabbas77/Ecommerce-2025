import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../features/cart/cartSlice";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-hot-toast";

function OrderFullFill() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items || []);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Address
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const res = await axiosInstance.get("/address/get");
        if (res.data.addresses && res.data.addresses.length > 0) {
          setAddress(res.data.addresses[0]);
        }
      } catch (error) {
        toast.error("Failed to load address!");
      }
      setLoading(false);
    };
    fetchAddress();
  }, []);

  const createOrder = async (paymentMethod) => {
    if (!address) return toast.error("Address not found!");
    if (!cartItems.length) return toast.error("Cart is empty!");

    try {
      const payload = {
        orderItems: cartItems.map((item) => ({
          product: item.product._id,
          name: item.product.title,
          quantity: item.quantity,
          price: item.product.price,
          image: item.product.image || "/placeholder.png",
        })),
        shippingAddress: {
          street: address.street,
          city: address.city,
          district: address.district,
          currentAddress: address.currentAddress,
        },
        paymentMethod,
        itemsPrice: cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0),
        totalPrice: cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0),
      };

      await axiosInstance.post("/orders/create", payload);

      toast.success("Order Placed Successfully!");
      dispatch(clearCart());

      setTimeout(() => navigate("/"), 3000);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Order failed!");
    }
  };

  if (loading) return <h1 className="text-center mt-10">Loading address...</h1>;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4">
      <h1 className="text-4xl mb-5 font-bold">Order Confirmation</h1>

      {address ? (
        <div className="bg-gray-100 p-6 rounded-lg shadow-md text-left w-96 mb-6">
          <h2 className="text-2xl font-semibold mb-3">Shipping Address</h2>
          <p><strong>Street:</strong> {address.street}</p>
          <p><strong>City:</strong> {address.city}</p>
          <p><strong>District:</strong> {address.district}</p>
          <p><strong>Current Address:</strong> {address.currentAddress}</p>
        </div>
      ) : (
        <p className="text-red-500 mb-4">No Address Found</p>
      )}

      <div className="bg-gray-50 p-4 rounded-lg shadow-md w-96 mb-6">
        <h2 className="text-2xl font-semibold mb-3">Your Cart</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty!</p>
        ) : (
          <ul className="space-y-2">
            {cartItems.map((item) => (
              <li key={item._id} className="flex justify-between items-center border-b py-2">
                <div className="flex items-center gap-2">
                  <img src={item.product.imageUrl} alt={item.product.title} className="w-12 h-12 object-cover rounded" />
                  <span>{item.product.title} x {item.quantity}</span>
                </div>
                <span>${item.product.price * item.quantity}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex gap-3 mt-5">
        <button onClick={() => createOrder("COD")} className="bg-green-500 text-white font-semibold px-6 py-3 rounded-lg">
          Cash on Delivery
        </button>
        <button onClick={() => createOrder("Online")} className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg">
          Pay Now
        </button>
      </div>

      <p className="mt-3 text-gray-500 text-sm">
        You will be redirected to home page in 3 seconds
      </p>
    </div>
  );
}

export default OrderFullFill;
