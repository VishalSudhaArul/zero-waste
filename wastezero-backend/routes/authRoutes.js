const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// ← Import ALL functions including new profile ones
const {
  register,
  login,
  getProfile,
  updateProfile
} = require("../controllers/authController");

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);

module.exports = router;