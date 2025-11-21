import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://ecommerce-2025-production.up.railway.app/api", // Railway production link
});

// Request Interceptor — ALWAYS read latest token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    console.log("Interceptor Token =", token);

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor — auto logout on 401
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized — Login expired");
      localStorage.removeItem("accessToken");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
