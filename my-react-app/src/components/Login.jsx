import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance"; // axiosInstance import karein
import { useNavigate, Link } from "react-router-dom";
import { showSuccessToast, showErrorToast } from "../utils/Toaster";
import { useAuth } from "../AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // axiosInstance se backend call
      const response = await axiosInstance.post("/users/login", loginData);
      const responseData = response.data;

      if (responseData?.accessToken && responseData?.user) {
        // AuthContext ke login function ko call karein
        login(responseData.accessToken, responseData.user);

        showSuccessToast("Login successful!");
        navigate("/", { replace: true });
      } else {
        showErrorToast("Incomplete data received from server.");
      }
    } catch (error) {
      showErrorToast(
        error.response?.data?.message || "Invalid credentials!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[89vh] bg-gray-100">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-8">
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <h1 className="text-center text-3xl font-bold text-gray-800">Login</h1>

          <input
            type="email"
            name="email"
            className="bg-gray-100 rounded-lg p-3 w-full border-2 border-transparent focus:border-blue-500 focus:outline-none transition"
            placeholder="Enter your email"
            value={loginData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            className="bg-gray-100 rounded-lg p-3 w-full border-2 border-transparent focus:border-blue-500 focus:outline-none transition"
            placeholder="Enter your password"
            value={loginData.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-lg p-3 text-white font-semibold transition ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                Processing...
              </div>
            ) : (
              "Login"
            )}
          </button>

          <p className="text-center text-gray-700">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
