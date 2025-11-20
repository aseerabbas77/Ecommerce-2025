import React, { useState, useEffect } from "react";
import axios from "axios";
import { showErrorToast } from "../utils/Toaster";

const EditProductModal = ({ product, token, onClose, onUpdateSuccess }) => {
  // Form ki state (initial values product prop se aayengi)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
  });
  const [imageFile, setImageFile] = useState(null); // Nayi image file ke liye state
  const [isLoading, setIsLoading] = useState(false);

  // Jab component ko product prop mile, to form state ko update karein
  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || "",
        description: product.description || "",
        price: product.price || "",
      });
    }
  }, [product]);

  // Input fields mein change handle karein
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Image file select hone par handle karein
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // Form submit hone par
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product) return;

    setIsLoading(true);

    // FormData object banayein (file upload ke liye zaroori hai)
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("price", formData.price);

    // Agar user ne nayi image select ki hai, tab hi use FormData mein add karein
    if (imageFile) {
      data.append("image", imageFile);
    }

    try {
      // Backend par PUT request bhejein
      await axios.put(
        `http://localhost:5000/api/products/${product._id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // File upload ke liye yeh header ZAROORI hai
          },
        }
      );
      onUpdateSuccess(); // Parent component ko batayein ki update successful ho gaya
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to update product!";
      showErrorToast(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!product) return null;

  //======= JSX / RENDER =======//
  return (
    // Modal ka background overlay
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      {/* Modal ka content */}
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-lg max-h-full overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Product</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Title Input */}
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Product Title"
            className="p-3 border rounded-md focus:ring-2 focus:ring-blue-400"
            required
          />
          {/* Description Textarea */}
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Product Description"
            className="p-3 border rounded-md focus:ring-2 focus:ring-blue-400"
            rows="4"
            required
          ></textarea>
          {/* Price Input */}
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            className="p-3 border rounded-md focus:ring-2 focus:ring-blue-400"
            required
          />
          {/* Image Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Change Image (Optional)
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="bg-gray-200 text-gray-800 px-5 py-2 rounded-md hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition flex items-center gap-2"
            >
              {isLoading && <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>}
              {isLoading ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;