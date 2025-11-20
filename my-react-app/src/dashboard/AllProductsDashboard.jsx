import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/products/productsSlice";
import { showSuccessToast, showErrorToast } from "../utils/Toaster";
import axios from "axios";
import { useAuth } from "../AuthContext";
import EditProductModal from "./EditProductModal"; // Modal component ko import karein

const AllProductsDashboard = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.products);
  const { token } = useAuth(); // AuthContext se token haasil karein

  // Component-level states
  const [loadingProductId, setLoadingProductId] = useState(null); // Delete button ke loader ke liye
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal ke open/close state ke liye
  const [selectedProduct, setSelectedProduct] = useState(null); // Jis product ko edit karna hai, uske data ke liye

  // Component mount hone par products fetch karein
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  //======= DELETE FUNCTIONALITY =======//
  const handleDeleteProduct = async (productId) => {
    if (!token) {
      showErrorToast("Authentication required. Please log in again.");
      return;
    }

    if (window.confirm(`Are you sure you want to delete this product?`)) {
      try {
        setLoadingProductId(productId);
        await axios.delete(
          `http://localhost:5000/api/products/${productId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        showSuccessToast(`Product deleted successfully!`);
        dispatch(fetchProducts()); // UI ko refresh karein
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to delete product!";
        showErrorToast(errorMessage);
      } finally {
        setLoadingProductId(null);
      }
    }
  };

  //======= EDIT/UPDATE MODAL HANDLING =======//
  // Edit button par click hone par yeh function call hoga
  const handleOpenEditModal = (product) => {
    setSelectedProduct(product); // Product data ko state mein set karein
    setIsModalOpen(true); // Modal ko kholein
  };

  // Modal band karne ka function
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null); // State ko clear karein
  };

  // Jab modal se product successfully update ho jaye
  const handleUpdateSuccess = () => {
    handleCloseModal(); // Modal band karein
    showSuccessToast("Product updated successfully!");
    dispatch(fetchProducts()); // Naye data ke liye product list ko refresh karein
  };

  //======= SEARCH/FILTER LOGIC =======//
  const filteredProducts = items.filter(
    (product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Loading aur Error states
  if (loading)
    return (
      <p className="text-center mt-10 text-blue-500 text-lg animate-pulse">
        Loading products...
      </p>
    );

  if (error)
    return (
      <p className="text-center mt-10 text-red-500 font-semibold">
        Error: {error}
      </p>
    );

  //======= JSX / RENDER =======//
  return (
    <div className="bg-gray-50 p-6 sm:p-10 flex flex-col h-full">
      {/* Heading */}
      <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-6">
        Manage Products
      </h2>

      {/* Search Bar */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-1/2 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
      </div>

      {/* Products Grid Container */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {filteredProducts.length === 0 ? (
          <p className="col-span-full text-center text-gray-500 mt-10">
            No products match your search.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="border rounded-lg shadow-sm hover:shadow-2xl transform hover:-translate-y-1 transition duration-300 bg-white flex flex-col justify-between"
              >
                {/* Product Image */}
                <div className="w-full h-64 sm:h-72 flex items-center justify-center bg-gray-100 rounded-t-lg overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="object-contain w-full h-full transition-transform duration-300 hover:scale-105"
                  />
                </div>
                {/* Product Info */}
                <div className="flex flex-col flex-grow p-4">
                  <h3 className="text-lg font-semibold text-gray-800 text-center mb-1 truncate">
                    {product.title}
                  </h3>
                  <p className="text-gray-500 text-sm text-center mb-2 line-clamp-2">
                    {product.description}
                  </p>
                  <p className="text-lg font-bold text-center mb-4 text-green-600">
                    ${product.price}
                  </p>
                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row justify-center gap-3 mt-auto">
                    {/* Edit Button */}
                    <button
                      onClick={() => handleOpenEditModal(product)} // Modal kholne wala function
                      className="flex items-center justify-center bg-yellow-500 text-white px-5 py-2 rounded-md w-full sm:w-auto hover:bg-yellow-600 transition shadow-md hover:shadow-lg"
                    >
                      Edit
                    </button>
                    {/* Delete Button */}
                    <button
                      disabled={loadingProductId === product._id}
                      onClick={() => handleDeleteProduct(product._id)}
                      className={`${
                        loadingProductId === product._id
                          ? "bg-red-400 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700"
                      } text-white px-5 py-2 rounded-md w-full sm:w-auto min-w-[120px] transition shadow-md hover:shadow-lg flex items-center justify-center`}
                    >
                      <span className="flex items-center gap-2 justify-center">
                        {loadingProductId === product._id && (
                          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                        )}
                        Delete
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal conditionally render hoga */}
      {isModalOpen && selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          token={token}
          onClose={handleCloseModal}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default AllProductsDashboard;