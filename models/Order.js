import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  orderItems: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      image: { type: String, required: true },
    },
  ],
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    currentAddress: { type: String },
  },
  paymentMethod: { type: String, enum: ["COD", "Card", "Online"], default: "COD" },
  itemsPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  orderStatus: { type: String, enum: ["Processing", "Shipped", "Delivered"], default: "Processing" },
  paidAt: Date,
  deliveredAt: Date,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);
