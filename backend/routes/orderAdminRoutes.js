import express from "express";
const router = express.Router();

import {
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
  getMyOrders,
} from "../controllers/adminOrderController.js";

// Apni middleware file se dono functions import karein
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js"; // Aapki file ka sahi path dein

// ===================================
//         ADMIN ROUTES
// ===================================

// Pehle `verifyToken` chalega, phir `verifyAdmin`, aur agar dono pass hue tab `getAllOrdersAdmin` chalega.
router.route("/all").get(verifyToken, verifyAdmin, getAllOrdersAdmin);

router.route("/status/:id").put(verifyToken, verifyAdmin, updateOrderStatusAdmin);


// ===================================
//          USER ROUTES
// ===================================

// Is route ke liye sirf logged-in hona zaroori hai, admin hona nahi.
// Isliye yahan sirf `verifyToken` lagayenge.
router.route("/get").get(verifyToken, getMyOrders);

export default router;
