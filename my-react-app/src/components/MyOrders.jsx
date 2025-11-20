import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance"; // <-- YOUR FILE PATH

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      const { data } = await axiosInstance.get("/orders/get"); 
      setOrders(data.orders || []);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch your orders.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg animate-pulse">Loading your orders...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 font-semibold">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen flex justify-center px-4 py-10 bg-gray-100">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow text-center text-gray-600">
            You have no orders yet.
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Order #{order._id.slice(-6)}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Processing"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="border-t pt-4">
                  {order.orderItems.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between py-3 border-b last:border-none"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.product?.imageUrl}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold">Rs. {item.price}</p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-5">
                  <p className="text-gray-700 font-medium">
                    Total Amount:
                    <span className="font-bold ml-2">Rs. {order.totalPrice}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Ordered on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
