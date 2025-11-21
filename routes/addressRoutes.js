import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { createAddress, getAddresses } from "../controllers/addressController.js";

const router = express.Router();

router.post("/create", verifyToken, createAddress);      // Create address
router.get("/get", verifyToken, getAddresses);       // Get user addresses

export default router;
