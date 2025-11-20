import React, { useState } from "react";
import axios from "axios";
import { showSuccessToast, showErrorToast } from "../utils/Toaster"; // path adjust karein agar Toast.jsx kisi aur folder me ho

function Register() {
  const [register, setRegister] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setRegister({ ...register, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // form reload na ho
    try {
      const response = await axios.post("http://localhost:5000/api/users/register", register); // apni API URL lagayein

      if (response.data.success) {
        showSuccessToast(response.data.message || "Registered successfully!");
        setRegister({ username: "", email: "", password: "" }); // form clear
      } else {
        showErrorToast(response.data.message || "Registration failed!");
      }
    } catch (error) {
      console.error(error);
      showErrorToast(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div
      className="flex justify-center items-center bg-gray-100"
      style={{ minHeight: "calc(100vh - 64px)" }}
    >
      <div className="bg-white rounded-lg shadow-lg w-96 max-w-full mx-4 p-8 mt-8 ">
        <h1 className="text-center text-4xl font-bold mb-6 text-gray-800">
          Sign Up
        </h1>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="flex flex-col">
            <label className="font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              className="bg-gray-100 rounded-lg p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your full name"
              value={register.username}
              name="username"
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              className="bg-gray-100 rounded-lg p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Please enter your email"
              value={register.email}
              name="email"
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label className="font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="bg-gray-100 rounded-lg p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
              value={register.password}
              name="password"
              onChange={handleChange}
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="bg-blue-600 text-white rounded-lg p-2 mt-2 shadow-md hover:bg-blue-700 transition duration-200"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-gray-700 mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 font-medium hover:underline">
            Login here
          </a>
        </p> 
      </div>
    </div>
  );
}

export default Register;
