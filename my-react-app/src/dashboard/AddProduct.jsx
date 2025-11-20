import React, { useState } from "react";
import axios from "axios";

function AddProduct() {
  const [product, setProduct] = useState({
    title: "",
    price: "",
    description: "",
    category: "", // ✅ new field added
  });
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", product.title);
    formData.append("price", product.price);
    formData.append("description", product.description);
    formData.append("category", product.category); // ✅ add category to formData
    formData.append("image", image);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/products/add",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log(res.data);
      alert("Product added successfully");

      setProduct({
        title: "",
        price: "",
        description: "",
        category: "",
      });
      setImage(null);
    } catch (err) {
      console.error(err);
      alert("Failed to add product");
    }
  };

  return (
    <div className="min-h-screen flex justify-center">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold text-blue-500 mt-5">Add Product</h1>
        <form className="flex flex-col justify-center" onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={product.title}
            onChange={handleChange}
            className="border p-2 my-2 rounded"
          />
          <input
            type="text"
            name="price"
            placeholder="Price"
            value={product.price}
            onChange={handleChange}
            className="border p-2 my-2 rounded"
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={product.description}
            onChange={handleChange}
            className="border p-2 my-2 rounded"
          />

          {/* ✅ New Category Input */}
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={product.category}
            onChange={handleChange}
            className="border p-2 my-2 rounded"
          />

          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            className="border p-2 my-2 rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 mt-3 rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
