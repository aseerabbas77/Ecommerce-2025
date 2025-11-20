import React, { useState, useContext } from "react";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { AuthContext } from "../AuthContext";

const Navbar = () => {
  const cartItems = useSelector((state) => state.cart?.items) || [];
  const [menu, setMenu] = useState(false);
  const { token, logout } = useContext(AuthContext);

  const itemCount = Array.isArray(cartItems)
    ? cartItems.reduce((total, item) => total + (item.quantity || 1), 0)
    : 0;

  return (
    <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-6 md:px-12 h-16 bg-gray-900 text-white shadow-md z-50">
      {/* Logo */}
      <h1 className="text-2xl font-bold">MyStore</h1>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-6 font-semibold">
        <Link to="/" className="hover:text-gray-300 transition">
          Home
        </Link>

        {token && (
          <Link to="/myorders" className="hover:text-gray-300 transition">
            My Orders
          </Link>
        )}

        {!token && (
          <>
            <Link to="/login" className="hover:text-gray-300 transition">
              Login
            </Link>
            <Link to="/register" className="hover:text-gray-300 transition">
              SignUp
            </Link>
          </>
        )}
      </div>

      {/* Right side: Cart + Logout */}
      {token && (
        <div className="flex items-center gap-4">
          <Link to="/cart">
            <button className="relative flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition">
              <FaShoppingCart />
              <span>Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </button>
          </Link>

          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition"
          >
            Logout
          </button>
        </div>
      )}

      {/* Hamburger */}
      <div className="flex items-center gap-4 relative md:hidden">
        <button
          className="text-2xl cursor-pointer"
          onClick={() => setMenu(true)}
        >
          <FaBars />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white flex flex-col items-center justify-center gap-6 shadow-lg transform transition-transform duration-300 w-3/5 ${
          menu ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <button
          onClick={() => setMenu(false)}
          className="absolute top-5 right-5 text-2xl hover:text-red-400"
        >
          <FaTimes />
        </button>

        <ul className="flex flex-col items-center gap-6 text-xl">
          <li>
            <Link to="/" onClick={() => setMenu(false)}>
              Home
            </Link>
          </li>

          {token && (
            <li>
              <Link to="/myorders" onClick={() => setMenu(false)}>
                My Orders
              </Link>
            </li>
          )}

          {!token && (
            <>
              <li>
                <Link to="/login" onClick={() => setMenu(false)}>
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" onClick={() => setMenu(false)}>
                  SignUp
                </Link>
              </li>
            </>
          )}

          {token && (
            <>
              <li>
                <Link to="/cart" onClick={() => setMenu(false)}>
                  <button className="relative flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition">
                    Cart
                    {itemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                        {itemCount}
                      </span>
                    )}
                  </button>
                </Link>
              </li>

              <li>
                <button
                  onClick={() => {
                    logout();
                    setMenu(false);
                  }}
                  className="bg-red-600 px-4 py-2 rounded-md"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
