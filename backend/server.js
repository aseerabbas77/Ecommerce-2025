import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cors from "cors"; // ✅ add this
import path from "path";
import cookieParser from "cookie-parser";
import orderRoutes from "./routes/orderRoutes.js";

import addressRoutes from "./routes/addressRoutes.js";
import orderAdminRoutes from './routes/orderAdminRoutes.js'
dotenv.config();
const app = express();

// ✅ Enable CORS (allow requests from frontend port 5173)
app.use(
  cors({
    origin: ["http://localhost:5173"], // array bhi use karlo (future proof)
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // 👈 OPTIONS add karo
    allowedHeaders: ["Content-Type", "Authorization"], // 👈 kuch browsers ke liye zaroori
  })
);

// Middleware
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(cookieParser());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// Routes
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/users", userRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/adminorders",orderAdminRoutes)

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
