// SideBar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";

const SideBar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Hamburger */}
      <div className="md:hidden p-4 bg-gray-800 text-white flex items-center">
        <button onClick={() => setOpen(!open)}>
          <Menu size={28} />
        </button>
        <h1 className="ml-4 text-xl font-semibold">Admin Panel</h1>
      </div>

      {/* Sidebar - MAKE IT STATIC FOR MD AND LARGER SCREENS, BUT WITHIN A FLEX LAYOUT */}
      {/* REMOVED 'fixed' from md:static, and will manage its width within Dashboard */}
      <div
        // For mobile, it's fixed and transforms.
        // For md and larger, it's part of the flex layout but we need to ensure its height
        className={`bg-gray-900 text-white p-6 w-64 h-screen flex-shrink-0
        transform ${open ? "translate-x-0 fixed top-0 left-0 z-50" : "-translate-x-full fixed top-0 left-0 z-50"} 
        transition-transform duration-300 md:translate-x-0 md:static`}
      >
        <h2 className="text-2xl font-bold mb-8">Dashboard</h2>

        <nav className="flex flex-col gap-4 text-lg">
          <Link
            to="/dashboard/add-product"
            className="hover:bg-gray-700 p-3 rounded-lg transition"
            onClick={() => setOpen(false)}
          >
            ➕ Add Product
          </Link>

          <Link
            to="/dashboard/all-products"
            className="hover:bg-gray-700 p-3 rounded-lg transition"
            onClick={() => setOpen(false)}
          >
            📦 All Products
          </Link>

          <Link
            to="/dashboard/orders"
            className="hover:bg-gray-700 p-3 rounded-lg transition"
            onClick={() => setOpen(false)}
          >
            📜 Orders
          </Link>
        </nav>
      </div>
    </>
  );
};

export default SideBar;