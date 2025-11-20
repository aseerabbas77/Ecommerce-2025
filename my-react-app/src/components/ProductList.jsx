import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/products/productsSlice";
import { addToCartAPI } from "../features/cart/cartSlice";
import { Link } from "react-router-dom";
import { showSuccessToast, showErrorToast } from "../utils/Toaster";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles

const ProductList = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.products);
  const [loadingProductId, setLoadingProductId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAddToCart = async (product) => {
    try {
      setLoadingProductId(product._id);
      await dispatch(addToCartAPI(product)).unwrap();
      showSuccessToast("Product added to cart!");
    } catch (err) {
      showErrorToast(err || "Failed to add to cart!");
    } finally {
      setLoadingProductId(null);
    }
  };

  const filteredProducts = items.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const carouselImages = [
    'https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop&',
    'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  ];

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

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Carousel Section */}
      <div className="w-full max-w-7xl mx-auto mt-4 rounded-lg overflow-hidden shadow-lg mb-8"> {/* Added mb-8 for spacing */}
        <Carousel
          showArrows={true}
          showThumbs={false}
          infiniteLoop={true}
          autoPlay={true}
          interval={5000}
          className="carousel-container"
        >
          {carouselImages.map((image, index) => (
            <div key={index}>
              <img src={image} alt={`Carousel slide ${index + 1}`} className="h-64 md:h-96 object-cover w-full" />
              <p className="legend">Discover Amazing Products</p>
            </div>
          ))}
        </Carousel>
      </div>

      {/* Main Content Wrapper */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col flex-1 py-6 sm:py-8">
        {/* Search Bar - Above "Our Products" heading */}
        <div className="flex justify-center mb-8"> {/* Added mb-8 for spacing */}
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-2/3 md:w-1/2 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-6">
          Our Products
        </h2>

        {/* Products Grid Section */}
        <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.length === 0 ? (
              <p className="col-span-full text-center text-gray-500 mt-10">
                No products match your search.
              </p>
            ) : (
              filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="border rounded-lg shadow-sm hover:shadow-2xl transform hover:-translate-y-1 transition duration-300 bg-white flex flex-col justify-between"
                >
                  {/* Product Image */}
                  <div className="w-full h-56 sm:h-64 flex items-center justify-center bg-gray-100 rounded-t-lg overflow-hidden">
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
                      <Link
                        to={`/product/${product._id}`}
                        className="flex items-center justify-center bg-blue-600 text-white px-8 py-2 rounded-md w-full sm:w-auto hover:bg-blue-700 transition shadow-md hover:shadow-lg"
                      >
                        View Details
                      </Link>
                      <button
                        disabled={loadingProductId === product._id}
                        onClick={() => handleAddToCart(product)}
                        className={`${
                          loadingProductId === product._id
                            ? "bg-green-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                        } text-white px-2 py-5 rounded-md w-full sm:w-auto min-w-[120px] transition shadow-md hover:shadow-lg flex items-center justify-center`}
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
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;