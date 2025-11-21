import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  // 🔹 User role (admin or normal user)
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  // 🔹 Basic info
  username: {
    type: String,
    required: [true, "Please enter your username"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    select: false, // ❗ Don't return password in queries by default
  },
    isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
  },

  // 🔹 Profile info
  phone: {
    type: String,
    default: "",
  },
  address: {
    street: { type: String, default: "" },
    city: { type: String, default: "" },
    district: { type: String, default: "" },
    currentAddress: { type: String, default: "" }, // tadrees / current location
  },

  // 🔹 Avatar / profile picture
  avatar: {
    public_id: { type: String, default: null },
    url: { type: String, default: "https://cdn-icons-png.flaticon.com/512/149/149071.png" }, // default avatar
  },

  // 🔹 Refresh Token for JWT
  refreshToken: {
    type: String,
    default: null,
  },

  // 🔹 Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);
export default User;
