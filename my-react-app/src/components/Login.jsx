import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { showSuccessToast, showErrorToast } from "../utils/Toaster";
import { useAuth } from "../AuthContext"; // AuthContext se custom hook import karein

const Login = () => {
  // AuthContext se 'login' function haasil karein
  const { login } = useAuth();
  const navigate = useNavigate();

  // Loading state (button ko disable karne aur spinner dikhane ke liye)
  const [loading, setLoading] = useState(false);

  // Form ke data ke liye state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Form input mein type karne par state ko update karein
  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  // Form submit hone par
  const handleSubmit = async (e) => {
    e.preventDefault(); // Default form submission ko rokein
    setLoading(true); // Loader shuru karein

    try {
      // Backend par login API ko call karein
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        loginData
      );

      const responseData = response.data;

      // Check karein ki backend se accessToken aur user object dono mile hain
      if (responseData && responseData.accessToken && responseData.user) {
        // AuthContext ke login function ko call karein aur dono cheezein pass karein
        login(responseData.accessToken, responseData.user);

        showSuccessToast("Login successful!");
        // User ko homepage par navigate karein
        navigate("/", { replace: true });
      } else {
        // Agar backend se poora data na mile
        showErrorToast("Incomplete data received from server.");
      }
    } catch (error) {
      // Agar API call fail ho jaye
      showErrorToast(
        error.response?.data?.message || "Invalid credentials!"
      );
    } finally {
      // Chahe success ho ya error, loader ko band karein
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

          {/* Loading State ke saath Dynamic Button */}
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