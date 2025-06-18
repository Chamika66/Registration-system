const express = require('express');
const router = express.Router();

const {
  login,
  registerAdmin,
  addCoadmin,
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  deleteUser,
  logout,
  refreshToken
} = require('../Controllers/authController');

const {
  authMiddleware,
  isAdmin
} = require('../Middleware/authMiddleware');

router.post("/register", registerAdmin);
router.post("/login", login);
router.post("/addCoadmin", authMiddleware, isAdmin, addCoadmin);
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePassword);
router.post("/logout", authMiddleware, logout);
router.post("/refresh-token", authMiddleware, refreshToken);
router.get("/users", authMiddleware, isAdmin, getAllUsers)
router.delete("/users/:userId", authMiddleware, isAdmin, deleteUser);


module.exports = router;
