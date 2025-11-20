import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { createOrder, getOrders } from "../controllers/orderController.js";

const router = express.Router();

router.post("/create", verifyToken, createOrder);

// Get all orders for user
router.get("/get", verifyToken, getOrders);
   // Get user's orders

export default router;
