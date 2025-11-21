import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  price: { 
    type: Number, 
    required: true 
  },
  imageUrl: { 
    type: String, 
    required: true 
  },
  category: {      // new field
    type: String,  // ya agar aap multiple categories allow karna chahte ho to [String] bhi use kar sakte ho
    required: true // agar zaroori nahi hai to isko hata sakte ho
  },
  quantity: {
    type: String,
    default: "1",
  },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
