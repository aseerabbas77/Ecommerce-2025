// routes/productRoutes.js
import express from "express";
import multer from "multer";
import { addProduct, deleteById, getById, getProducts, updateById } from "../controllers/productController.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" }); 

router.post("/add", upload.single("image"), addProduct); // 👈 field name "image"
router.get("/all", getProducts);
router.get("/:id", getById);
router.delete("/:id", deleteById);
router.put("/:id", upload.single("image"), updateById);
export default router;
