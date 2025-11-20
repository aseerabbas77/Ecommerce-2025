import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

export const addProduct = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);

    const newProduct = new Product({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      imageUrl: result.secure_url, // 👈 Cloudinary URL save karo
      category: req.body.category,
      quantity: req.body.quantity || "1", // 👈 quantity add ki
    });

    await newProduct.save();
    res.status(201).json({
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding product", error: error.message });
  }
};


export const getProducts = async (req, res) => {
  try {
    const products = await Product.find(); // MongoDB se saare products lo
    res.status(200).json(products); // frontend ko bhej do
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id); // ID se product lo
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching product", error: error.message });
  }
};

export const deleteById = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting product", error: error.message });
  }
};

export const updateById = async (req, res) => {
  try {
    const updatedData = {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
    };

    const product = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating product", error: error.message });
  }
};

