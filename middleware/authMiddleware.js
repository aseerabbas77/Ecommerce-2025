import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Aapke User model ka path

// YEH AAPKA EXISTING FUNCTION HAI - ISE CHANGE NA KAREIN
// Yeh check karta hai ki user logged-in hai ya nahi.
export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access denied, no token provided" });
    }

    const token = authHeader.split(" ")[1];
    
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // Make sure your secret key name matches

    // User ko request object mein attach karein
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
        return res.status(401).json({ message: "User not found" });
    }

    next(); // Agle middleware par jayein
  } catch (error) {
    console.error("Auth Error:", error.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};


// 👇 YEH NAYA ADMIN CHECK MIDDLEWARE HAI
// Yeh check karta hai ki jo user logged-in hai, woh admin hai ya nahi.
// Yeh hamesha verifyToken ke BAAD chalna chahiye.
export const verifyAdmin = (req, res, next) => {
  // verifyToken ne pehle hi req.user set kar diya hoga
  if (req.user && req.user.role === "admin") {
    next(); // Haan, user admin hai, aage badhne do
  } else {
    // Agar user logged-in hai lekin admin nahi hai
    res.status(403).json({ message: "Access denied. Admin role required." });
  }
};
