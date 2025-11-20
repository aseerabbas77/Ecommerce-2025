// src/components/ProductDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/products/productsSlice";
import { addToCartAPI } from "../features/cart/cartSlice";
import { showSuccessToast, showErrorToast } from "../utils/Toaster";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth);
  const user = auth?.user;

  const productsState = useSelector((state) => state.products);
  const { items: allProducts, loading: productsLoading } = productsState;

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingProductId, setLoadingProductId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all products from Redux store
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch single product by ID
        const currentProduct = allProducts.find((p) => p._id === id);
        if (!currentProduct) {
          // If product not in store, fetch all products
          await dispatch(fetchProducts()).unwrap();
        }

        const updatedAllProducts = allProducts.length > 0 ? allProducts : (await dispatch(fetchProducts()).unwrap());

        const mainProduct = updatedAllProducts.find((p) => p._id === id);
        if (!mainProduct) {
          setError("Product not found");
          return;
        }
        setProduct(mainProduct);

        // Related products: same category, exclude main product
        const related = updatedAllProducts.filter(
          (p) => p._id !== mainProduct._id && p.category === mainProduct.category
        );
        setRelatedProducts(related);

      } catch (err) {
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, allProducts, dispatch]);

  // Add to Cart
  const handleAddToCart = async (product) => {
    try {
      setLoadingProductId(product._id);
      await dispatch(addToCartAPI(product)).unwrap();
      showSuccessToast("Product added to cart!");
    } catch (err) {
      if (err.response?.status === 401) {
        showErrorToast("Please login first!");
        navigate("/login");
      } else {
        showErrorToast(err.response?.data?.message || err.message || "Failed to add to cart!");
      }
    } finally {
      setLoadingProductId(null);
    }
  };

  if (loading || productsLoading)
    return <p className="text-center text-blue-500 text-lg mt-10">Loading...</p>;

  if (error)
    return <p className="text-center text-red-500 mt-10">{error}</p>;

  if (!product)
    return <p className="text-center text-gray-500 mt-10">No product found.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 mt-10">
      {/* Product Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row gap-10">
        {/* Left: Image */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="h-[380px] object-contain rounded-lg shadow-md"
          />
        </div>

        {/* Right: Info */}
        <div className="w-full md:w-1/2 space-y-4">
          {product.category && (
            <span className="px-4 py-1 inline-block bg-blue-100 text-blue-700 rounded-full text-sm font-medium shadow-sm">
              {product.category}
            </span>
          )}

          <h1 className="text-4xl font-bold text-gray-800">{product.title}</h1>
          <p className="text-gray-600 text-lg">{product.description}</p>
          <p className="text-3xl font-semibold text-green-700">${product.price}</p>

          <div className="flex gap-4 mt-4 flex-wrap">
            <button
              onClick={() => navigate("/")}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg shadow-sm transition"
            >
              ← Back
            </button>

            <button
              onClick={() => handleAddToCart(product)}
              disabled={loadingProductId === product._id}
              className={`${
                loadingProductId === product._id
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              } text-white px-7 py-3 rounded-lg shadow-md transition min-w-[140px] flex items-center justify-center`}
            >
              <span className="flex items-center gap-2 justify-center">
                {loadingProductId === product._id && (
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                )}
                Add to Cart
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Related Products
        </h2>

        {relatedProducts.length === 0 && (
          <p className="text-gray-500">No related products found.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {relatedProducts.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow hover:shadow-lg p-4 flex flex-col items-center transition"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="h-[160px] object-contain mb-3"
              />
              <h3 className="font-semibold text-gray-800 text-center">{item.title}</h3>
              <p className="text-green-600 font-bold mt-1">${item.price}</p>
              <Link
                to={`/product/${item._id}`}
                className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
