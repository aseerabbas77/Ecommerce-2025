import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";
import crypto from "crypto";
import senderVerificationEmail from "../utils/senderVerificationEmail.js";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 1. Ek unique token banayein
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      verificationToken: verificationToken, // Token ko user ke saath save karein
    });

    await newUser.save();

    // 2. User ko verification email bhejein
    const verificationUrl = `http://localhost:5173/verify-email/${verificationToken}`; // Apne domain aur port ke hisab se change karein
    await senderVerificationEmail(newUser.email, verificationUrl);

    res.status(201).json({
      message:
        "User registered successfully. Please check your email to verify your account.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ CHANGE 1: Password ko explicitly select karein
    // '.select("+password")' Mongoose ko batata hai ki is query ke liye password zaroor chahiye.
    const user = await User.findOne({ email }).select("+password");

    // User not found check
    if (!user) {
      // Security ke liye generic message istemal karein
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // ✅ CHANGE 2: Email verification check
    // Yeh check password compare karne se pehle hona chahiye.
    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email address before logging in.",
      });
    }

    // Password match check
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Yahan bhi generic message istemal karein
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Neeche ka saara code bilkul waisa hi rahega

    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Save refresh token to DB
    user.refreshToken = refreshToken;
    await user.save();

    // ✅ Store in cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // local: false
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 15 * 60 * 1000, // 15 min
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params; // URL se token nikalein

    // 1. Token ke basis par user ko dhoondein
    const user = await User.findOne({ verificationToken: token });

    // 2. Agar user nahi milta, toh token invalid hai
    if (!user) {
      // Yahan aap user ko ek error page par redirect kar sakte hain
      return res
        .status(400)
        .json({ message: "Invalid or expired verification token." });
    }

    // 3. User ko verified mark karein aur token ko clear kar dein
    user.isVerified = true;
    user.verificationToken = undefined; // Token ko null ya undefined set karein taaki dobara istemal na ho
    await user.save();

    // 4. Success response bhejein ya user ko login page par redirect karein
    // For an API, sending a success message is good.
    // For a web app, you might redirect: res.redirect('http://your-frontend.com/login?verified=true');
    res
      .status(200)
      .json({ message: "Email verified successfully. You can now log in." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Email verification failed", error: error.message });
  }
};

// ✅ Create or Update Profile
export const createProfile = async (req, res) => {
  try {
    const userId = req.user.id; // JWT middleware se aayega
    const { username, phone, street, city, district, currentAddress } =
      req.body;

    let avatarData;

    // ✅ Agar image upload hui hai
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "user_avatars",
      });
      avatarData = { public_id: result.public_id, url: result.secure_url };
    }

    // ✅ Update user document
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username,
        phone,
        address: { street, city, district, currentAddress },
        ...(avatarData && { avatar: avatarData }), // sirf image update kare agar uploaded
      },
      { new: true, runValidators: true }
    ).select("-password -refreshToken");

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      success: true,
      message: "Profile created/updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAvatar = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file)
      return res.status(400).json({ message: "No image uploaded" });

    // Cloudinary upload
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "user_avatars",
    });

    const avatarData = { public_id: result.public_id, url: result.secure_url };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: avatarData },
      { new: true }
    ).select("-password -refreshToken");

    res.status(200).json({
      success: true,
      message: "Avatar updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, phone, street, city, district, currentAddress } =
      req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username,
        phone,
        address: { street, city, district, currentAddress },
      },
      { new: true, runValidators: true }
    ).select("-password -refreshToken");

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// ✅ Get Profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // JWT middleware se aayega

    const user = await User.findById(userId).select("-password -refreshToken");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token" });
  }

  try {
    // check if refresh token exists in DB
    const user = await User.findOne({ refreshToken });
    if (!user)
      return res.status(403).json({ message: "Invalid refresh token" });

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err)
        return res.status(403).json({ message: "Invalid or expired token" });

      const newAccessToken = jwt.sign(
        { id: decoded.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      });

      res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error refreshing token", error: error.message });
  }
};

// controllers/userController.js

export const logoutUser = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({ message: "No refresh token found" });
    }

    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid token or user not found" });
    }

    user.refreshToken = null;
    await user.save();

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // ✅ Response
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error logging out", error: error.message });
  }
};
