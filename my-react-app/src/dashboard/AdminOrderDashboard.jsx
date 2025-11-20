import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance"; // Aapka configured axios
import { showSuccessToast, showErrorToast } from "../utils/Toaster";

const AdminOrdersDashboard = () => {
  // State for storing all orders
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // States for managing status updates for each individual order
  const [statusChanges, setStatusChanges] = useState({}); // e.g., { orderId1: 'Shipped', orderId2: 'Delivered' }
  const [updatingStatusId, setUpdatingStatusId] = useState(null); // Tracks which order's status is currently being updated

  // Function to fetch all orders from the admin endpoint
  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      // Backend se saare orders fetch karein (yeh admin-only route hai)
      const { data } = await axiosInstance.get("/adminorders/all");
      setOrders(data.orders || []);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch orders.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders when the component mounts
  useEffect(() => {
    fetchAllOrders();
  }, []);

  // Function to handle status selection from the dropdown
  const handleStatusChange = (orderId, newStatus) => {
    setStatusChanges({
      ...statusChanges,
      [orderId]: newStatus,
    });
  };

  // Function to submit the status update to the backend
  const handleUpdateStatus = async (orderId) => {
    const newStatus = statusChanges[orderId];
    if (!newStatus) {
      showErrorToast("Please select a new status first.");
      return;
    }

    setUpdatingStatusId(orderId); // Show loader on the specific update button

    try {
      // Backend ko status update karne ke liye request bhejein
      await axiosInstance.put(`/adminorders/status/${orderId}`, {
        status: newStatus,
      });
      showSuccessToast("Order status updated successfully!");
      // Refresh the UI with the latest data
      fetchAllOrders();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to update status.";
      showErrorToast(errorMessage);
    } finally {
      setUpdatingStatusId(null); // Hide loader
      // Clear the selected status for this order from the state
      const newStatusChanges = { ...statusChanges };
      delete newStatusChanges[orderId];
      setStatusChanges(newStatusChanges);
    }
  };

  // --- Render Logic ---

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-600 text-lg animate-pulse">
          Loading All Customer Orders...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-red-600 font-semibold text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 sm:p-8 h-full overflow-y-auto custom-scrollbar">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Customer Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow text-center text-gray-600">
          There are no orders to display.
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white p-6 rounded-xl shadow-md transition-shadow hover:shadow-lg">
              {/* Order Header: ID, Date, Total */}
              <div className="flex flex-wrap justify-between items-center mb-4 border-b pb-4 gap-2">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="font-bold text-lg text-green-600">Rs. {order.totalPrice}</div>
              </div>

              {/* Customer and Shipping Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-bold mb-2 text-gray-700">Customer Details</h3>
                  <p><strong>Name:</strong> {order.user?.name || "N/A"}</p>
                  <p><strong>Email:</strong> {order.user?.email || "N/A"}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-bold mb-2 text-gray-700">Shipping Address</h3>
                  <p>{order.shippingAddress?.street || "N/A"}</p>
                  <p>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
                  <p>{order.shippingAddress?.district || "N/A"}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t pt-4">
                <h3 className="font-bold mb-2 text-gray-700">Order Items ({order.orderItems.length})</h3>
                {order.orderItems.map((item) => (
                  <div key={item._id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <div className="flex items-center gap-3">
                      <img src={item.product?.imageUrl} alt={item.name} className="w-14 h-14 rounded object-cover" />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-semibold">Rs. {item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              {/* Admin Actions: Status Update */}
              <div className="border-t pt-4 mt-4 flex flex-wrap items-center justify-between gap-4">
                 <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === "Delivered" ? "bg-green-100 text-green-700" :
                      order.status === "Shipped" ? "bg-blue-100 text-blue-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                    Current Status: <strong>{order.status}</strong>
                  </span>
                <div className="flex items-center gap-3">
                  <select
                    value={statusChanges[order._id] || ""}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="p-2 border rounded-md bg-white focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="" disabled>Change Status</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                  <button
                    onClick={() => handleUpdateStatus(order._id)}
                    disabled={!statusChanges[order._id] || updatingStatusId !== null}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                     {updatingStatusId === order._id && <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>}
                    Update
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrdersDashboard;