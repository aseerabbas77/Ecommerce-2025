import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Address = () => {
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    street: "",
    city: "",
    district: "",
    currentAddress: "",
  });

  const [errors, setErrors] = useState({}); // 🛑 Validation errors

  const validateFields = () => {
    let newErrors = {};

    if (!address.street.trim()) newErrors.street = "Street is required";
    if (!address.city.trim()) newErrors.city = "City is required";
    if (!address.district.trim()) newErrors.district = "District is required";
    if (!address.currentAddress.trim())
      newErrors.currentAddress = "Current Address is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // ✔ no errors = valid form
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      toast.error("Please fill all required fields!");
      return;
    }

    const token = localStorage.getItem("accessToken");

    if (!token) {
      toast.error("Please login first!");
      return;
    }

    try {
      const res = await axiosInstance.post("/address/create", address);

      toast.success("Address saved successfully!");

      setTimeout(() => {
        navigate("/order");
      }, 2000);

    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save address!");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Add Address</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* Street */}
        <div>
          <input
            type="text"
            placeholder="Street"
            className="p-2 border rounded w-full"
            value={address.street}
            required
            onChange={(e) =>
              setAddress({ ...address, street: e.target.value })
            }
          />
          {errors.street && (
            <p className="text-red-600 text-sm mt-1">{errors.street}</p>
          )}
        </div>

        {/* City */}
        <div>
          <input
            type="text"
            placeholder="City"
            className="p-2 border rounded w-full"
            value={address.city}
            required
            onChange={(e) =>
              setAddress({ ...address, city: e.target.value })
            }
          />
          {errors.city && (
            <p className="text-red-600 text-sm mt-1">{errors.city}</p>
          )}
        </div>

        {/* District */}
        <div>
          <input
            type="text"
            placeholder="District"
            className="p-2 border rounded w-full"
            value={address.district}
            required
            onChange={(e) =>
              setAddress({ ...address, district: e.target.value })
            }
          />
          {errors.district && (
            <p className="text-red-600 text-sm mt-1">{errors.district}</p>
          )}
        </div>

        {/* Current Address */}
        <div>
          <input
            type="text"
            placeholder="Current Address"
            className="p-2 border rounded w-full"
            value={address.currentAddress}
            required
            onChange={(e) =>
              setAddress({ ...address, currentAddress: e.target.value })
            }
          />
          {errors.currentAddress && (
            <p className="text-red-600 text-sm mt-1">
              {errors.currentAddress}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Address
        </button>
      </form>
    </div>
  );
};

export default Address;
