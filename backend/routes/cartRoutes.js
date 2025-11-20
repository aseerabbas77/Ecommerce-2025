import express from "express";
import {
  addToCart,
  getCartItems,
  removeFromCart,
  clearCart,
  increaseQuantity,
  decreaseQuantity,
} from "../controllers/cartController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", verifyToken, addToCart);
router.get("/all", verifyToken, getCartItems);
router.delete("/remove/:id", verifyToken, removeFromCart);
router.delete("/clear", verifyToken, clearCart);
router.put("/increase/:id", verifyToken, increaseQuantity);
router.put("/decrease/:id", verifyToken, decreaseQuantity);

export default router;
