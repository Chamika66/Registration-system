// studentController.js (Full Version with Validation, Search, Pagination, Analytics)

const Joi = require("joi");
const asyncHandler = require("express-async-handler");
const Student = require("../Models/studentModel");
const mongoose = require('mongoose');

// Joi Schemas
const createStudentSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  birthday: Joi.date().max('now').required(),
  japaneseLevel: Joi.string().valid('N5', 'N4', 'N3', 'JLPT', 'NAT').required(),
  gender: Joi.string().valid('male', 'female').optional(),
  phone: Joi.string().min(10).max(15).required(),
  photograph: Joi.string().required(),
  visaType: Joi.string().valid('student', 'ssw').required(),
  status: Joi.string().valid('pending', 'approved', 'rejected').optional()
});

// Helper
const handleValidationError = (error, res) => {
  return res.status(400).json({
    success: false,
    message: "Validation failed",
    errors: error.details.map((detail) => detail.message)
  });
};

const buildSearchQuery = (queryParams) => {
  const { search, japaneseLevel, gender, visaType, status } = queryParams;
  let query = {};
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } }
    ];
  }
  if (japaneseLevel) query.japaneseLevel = japaneseLevel;
  if (gender) query.gender = gender;
  if (visaType) query.visaType = visaType;
  if (status) query.status = status;
  return query;
};

// Create student
const createStudent = asyncHandler(async (req, res) => {

  if (req.file) {
    req.body.photograph = req.file.filename;
  }
  
  const { error } = createStudentSchema.validate(req.body);
  if (error) return handleValidationError(error, res);

  const {
    firstName, lastName, email, birthday, japaneseLevel,
    gender, phone, photograph, visaType, status
  } = req.body;

  const emailExists = await Student.findOne({ email });
  if (emailExists) return res.status(409).json({ success: false, message: "Email already exists" });

  const phoneExists = await Student.findOne({ phone });
  if (phoneExists) return res.status(409).json({ success: false, message: "Phone already exists" });

  const fullName = `${firstName} ${lastName}`;

  const student = new Student({
    firstName, lastName, fullName, email, birthday, japaneseLevel,
    gender: gender || 'male', phone, photograph, visaType,
    status: status || 'pending',
    createdBy: req.user?.id,
    updatedBy: req.user?.id
  });

  const savedStudent = await student.save();
  res.status(201).json({ success: true, student: savedStudent });
});

// Get all students with filters + pagination
const getAllStudents = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const sortBy = req.query.sortBy || 'createdAt';
  const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

  const query = buildSearchQuery(req.query);

  const students = await Student.find(query)
    .populate('createdBy updatedBy', 'firstName lastName username')
    .sort({ [sortBy]: sortOrder })
    .skip(skip).limit(limit);

  const total = await Student.countDocuments(query);
  res.status(200).json({
    success: true,
    students,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      limit
    }
  });
});

// Get one student
const getStudentById = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id)
    .populate('createdBy updatedBy', 'firstName lastName username');
  if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
  res.status(200).json({ success: true, student });
});

// Update student
const updateStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

  const updates = req.body;

  if (updates.firstName || updates.lastName) {
    updates.fullName = `${updates.firstName || student.firstName} ${updates.lastName || student.lastName}`;
  }

  updates.updatedBy = req.user?.id;
  updates.updatedAt = new Date();

  const updatedStudent = await Student.findByIdAndUpdate(req.params.id, updates, { new: true });
  res.status(200).json({ success: true, student: updatedStudent });
});

// Delete student
const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

  await student.deleteOne();
  res.status(200).json({ success: true, message: 'Student deleted' });
});

// ==============================
// @desc    Dashboard statistics
// @route   GET /api/students/stats
// @access  Private
// ==============================
const getDashboardStats = asyncHandler(async (req, res) => {
  const totalStudents = await Student.countDocuments();
  const visaStats = await Student.aggregate([
    { $group: { _id: "$visaType", count: { $sum: 1 } } }
  ]);
  const statusStats = await Student.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);

  const visaCount = visaStats.reduce((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {});

  const statusCount = statusStats.reduce((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {});

  res.status(200).json({
    success: true,
    stats: {
      totalStudents,
      visaType: visaCount,
      status: statusCount
    }
  });
});

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getDashboardStats
};
