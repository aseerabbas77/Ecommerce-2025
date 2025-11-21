import express from 'express';
// Step 1: Naye controller ko import karein
import { 
    createProfile, 
    getProfile, 
    loginUser, 
    logoutUser, 
    refreshAccessToken, 
    registerUser, 
    updateAvatar, 
    updateProfile,
    verifyEmail // <-- Yeh add karein
} from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import multer from 'multer';

const upload = multer({ dest: "uploads/" }); 
const router = express.Router();

// --- AUTHENTICATION ROUTES ---
router.post('/register', registerUser); 
router.post("/login", loginUser);

// Step 2: Verification ke liye naya route add karein
// URL mein ':token' ek dynamic parameter hai jo user ke token ko capture karega
router.get('/verify-email/:token', verifyEmail);

router.get("/refresh", refreshAccessToken);
router.post("/logout", logoutUser);


// --- PROFILE ROUTES (Protected) ---
// ✅ Create/Update profile (with optional avatar)
router.put("/create-profile", verifyToken, upload.single("avatar"), createProfile);

// ✅ Update avatar only
router.put("/update-avatar", verifyToken, upload.single("avatar"), updateAvatar);

// ✅ Update profile fields only
router.put("/update-profile", verifyToken, updateProfile);
    
// ✅ Get profile
router.get("/me", verifyToken, getProfile);

export default router;