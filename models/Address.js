import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  district: { type: String, required: true },
  currentAddress: { type: String }, // optional
});

const Address = mongoose.model("Address", addressSchema);
export default Address;
