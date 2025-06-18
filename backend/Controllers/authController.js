const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const asyncHandler = require("express-async-handler");
const ProfileModel = require("../Models/userModel");

// =================== VALIDATION SCHEMAS ===================
const registerSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  username: Joi.string().min(5).max(20).alphanum().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)')).required()
    .messages({
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    })
});

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

const updateProfileSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).optional(),
  lastName: Joi.string().min(2).max(50).optional(),
  email: Joi.string().email().optional()
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)')).required()
    .messages({
      'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, and one number'
    })
});

// =================== HELPER FUNCTIONS ===================
const generateToken = (userId, userRole) => {
  return jwt.sign(
    { id: userId, role: userRole },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const handleValidationError = (error, res) => {
  return res.status(400).json({
    success: false,
    message: "Validation failed",
    errors: error.details.map((detail) => detail.message)
  });
};

//******************************************* */
const registerAdmin = asyncHandler(async (req, res) => {
  // Check if admin already exists
  const existingAdmin = await ProfileModel.findOne({ role: "admin" });
  if (existingAdmin) {
    return res.status(403).json({
      success: false,
      message: "Admin already exists. Only one admin is allowed."
    });
  }

  const { error } = registerSchema.validate(req.body);
  if (error) return handleValidationError(error, res);

  const { firstName, lastName, username, email, password } = req.body;

  // Check for existing username
  const existingUsername = await ProfileModel.findOne({ username });
  if (existingUsername) {
    return res.status(409).json({
      success: false,
      message: "Username already exists"
    });
  }

  // Check for existing email
  const existingEmail = await ProfileModel.findOne({ email });
  if (existingEmail) {
    return res.status(409).json({
      success: false,
      message: "Email already exists"
    });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newAdmin = new ProfileModel({
    firstName,
    lastName,
    username,
    email,
    password: hashedPassword,
    role: "admin"
  });

  await newAdmin.save();

  const token = generateToken(newAdmin._id, newAdmin.role);

  res.status(201).json({
    success: true,
    message: "Admin registered successfully",
    user: {
      id: newAdmin._id,
      firstName: newAdmin.firstName,
      lastName: newAdmin.lastName,
      username: newAdmin.username,
      email: newAdmin.email,
      role: newAdmin.role
    },
    token
  });
});

//******************************************* */
const login = asyncHandler(async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return handleValidationError(error, res);

  const { username, password } = req.body;
  const user = await ProfileModel.findOne({ username });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid username or password"
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid username or password"
    });
  }

  const token = generateToken(user._id, user.role);

  res.status(200).json({
    success: true,
    message: "Login successful",
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      role: user.role
    },
    token
  });
});

//******************************************* */
const addCoadmin = asyncHandler(async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) return handleValidationError(error, res);

  const { firstName, lastName, username, email, password } = req.body;

  // Check for existing username
  const existingUsername = await ProfileModel.findOne({ username });
  if (existingUsername) {
    return res.status(409).json({
      success: false,
      message: "Username already exists"
    });
  }

  // Check for existing email
  const existingEmail = await ProfileModel.findOne({ email });
  if (existingEmail) {
    return res.status(409).json({
      success: false,
      message: "Email already exists"
    });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newCoadmin = new ProfileModel({
    firstName,
    lastName,
    username,
    email,
    password: hashedPassword,
    role: "coadmin"
  });

  await newCoadmin.save();

  res.status(201).json({
    success: true,
    message: "Coadmin created successfully",
    user: {
      id: newCoadmin._id,
      firstName: newCoadmin.firstName,
      lastName: newCoadmin.lastName,
      username: newCoadmin.username,
      email: newCoadmin.email,
      role: newCoadmin.role
    }
  });
});

// =================== NEW FEATURES ===================

//******************************************* */
// Get Current User Profile
const getProfile = asyncHandler(async (req, res) => {
  const user = await ProfileModel.findById(req.user.id).select('-password');
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  });
});

//******************************************* */
// Update User Profile
const updateProfile = asyncHandler(async (req, res) => {
  const { error } = updateProfileSchema.validate(req.body);
  if (error) return handleValidationError(error, res);

  const { firstName, lastName, email } = req.body;
  const userId = req.user.id;

  // If email is being updated, check if it's already taken
  if (email) {
    const existingEmail = await ProfileModel.findOne({ 
      email, 
      _id: { $ne: userId } 
    });
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "Email already exists"
      });
    }
  }

  const updatedUser = await ProfileModel.findByIdAndUpdate(
    userId,
    { 
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(email && { email })
    },
    { new: true, runValidators: true }
  ).select('-password');

  if (!updatedUser) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user: {
      id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role
    }
  });
});

//******************************************* */
// Change Password
const changePassword = asyncHandler(async (req, res) => {
  const { error } = changePasswordSchema.validate(req.body);
  if (error) return handleValidationError(error, res);

  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  const user = await ProfileModel.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  // Verify current password
  const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isCurrentPasswordValid) {
    return res.status(400).json({
      success: false,
      message: "Current password is incorrect"
    });
  }

  // Check if new password is different
  const isSamePassword = await bcrypt.compare(newPassword, user.password);
  if (isSamePassword) {
    return res.status(400).json({
      success: false,
      message: "New password must be different from current password"
    });
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 12);
  
  await ProfileModel.findByIdAndUpdate(userId, {
    password: hashedNewPassword
  });

  res.status(200).json({
    success: true,
    message: "Password changed successfully"
  });
});

//******************************************* */
// Get All Users (Admin only)
const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const search = req.query.search || '';
  const role = req.query.role || '';

  // Build search query
  let query = {};
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { username: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }
  if (role) {
    query.role = role;
  }

  const users = await ProfileModel.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalUsers = await ProfileModel.countDocuments(query);
  const totalPages = Math.ceil(totalUsers / limit);

  res.status(200).json({
    success: true,
    users,
    pagination: {
      currentPage: page,
      totalPages,
      totalUsers,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  });
});

//******************************************* */
// Get User by ID (Admin only)
const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  
  const user = await ProfileModel.findById(userId).select('-password');
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  });
});

//******************************************* */
// Update User Role (Admin only)
const updateUserRole = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  if (!role || !['admin', 'coadmin'].includes(role)) {
    return res.status(400).json({
      success: false,
      message: "Invalid role. Must be 'admin' or 'coadmin'"
    });
  }

  // Prevent admin from changing their own role
  if (userId === req.user.id) {
    return res.status(400).json({
      success: false,
      message: "You cannot change your own role"
    });
  }

  const user = await ProfileModel.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  // If promoting to admin, check if admin already exists
  if (role === 'admin') {
    const existingAdmin = await ProfileModel.findOne({ role: 'admin', _id: { $ne: userId } });
    if (existingAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only one admin is allowed"
      });
    }
  }

  const updatedUser = await ProfileModel.findByIdAndUpdate(
    userId,
    { role },
    { new: true }
  ).select('-password');

  res.status(200).json({
    success: true,
    message: `User role updated to ${role}`,
    user: {
      id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role
    }
  });
});

//******************************************* */
// Delete User (Admin only)
const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Prevent admin from deleting themselves
  if (userId === req.user.id) {
    return res.status(400).json({
      success: false,
      message: "You cannot delete your own account"
    });
  }

  const user = await ProfileModel.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  // Prevent deleting another admin
  if (user.role === "admin") {
    return res.status(403).json({
      success: false,
      message: "Cannot delete admin user"
    });
  }

  await ProfileModel.findByIdAndDelete(userId);

  res.status(200).json({
    success: true,
    message: `User ${user.username} deleted successfully`
  });
});

//******************************************* */
// Get User Statistics (Admin only)
const getUserStats = asyncHandler(async (req, res) => {
  const totalUsers = await ProfileModel.countDocuments();
  const adminCount = await ProfileModel.countDocuments({ role: 'admin' });
  const coadminCount = await ProfileModel.countDocuments({ role: 'coadmin' });
  
  // Users created in the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentUsers = await ProfileModel.countDocuments({
    createdAt: { $gte: thirtyDaysAgo }
  });

  res.status(200).json({
    success: true,
    stats: {
      totalUsers,
      adminCount,
      coadminCount,
      recentUsers
    }
  });
});

//******************************************* */
// Refresh Token
const refreshToken = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const user = await ProfileModel.findById(userId).select('-password');
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  const newToken = generateToken(user._id, user.role);

  res.status(200).json({
    success: true,
    message: "Token refreshed successfully",
    token: newToken,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      role: user.role
    }
  });
});

//******************************************* */
// Logout
const logout = asyncHandler(async (req, res) => {
  // With JWT, logout is handled client-side by removing the token
  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
});

module.exports = {
  registerAdmin,
  login,
  addCoadmin,
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getUserStats,
  refreshToken,
  logout
};