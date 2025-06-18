const Student = require('../Models/studentModel');

// ==============================
// @desc    Create a new student
// @route   POST /api/students
// @access  Private
// ==============================
const createStudent = async (req, res) => {
  try {
    const {
      firstName, lastName, fullName, email, birthday,
      japaneseLevel, gender, phone, photograph,
      visaType, status
    } = req.body;

    const newStudent = new Student({
      firstName,
      lastName,
      fullName,
      email,
      birthday,
      japaneseLevel,
      gender,
      phone,
      photograph,
      visaType,
      status,
      createdBy: req.user.id,
      updatedBy: req.user.id
    });

    await newStudent.save();
    res.status(201).json({ success: true, message: 'Student created successfully', student: newStudent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==============================
// @desc    Get all students
// @route   GET /api/students
// @access  Private
// ==============================
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate('createdBy updatedBy', 'username role');
    res.status(200).json({ success: true, students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==============================
// @desc    Get a student by ID
// @route   GET /api/students/:id
// @access  Private
// ==============================
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.status(200).json({ success: true, student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==============================
// @desc    Update a student
// @route   PUT /api/students/:id
// @access  Private
// ==============================
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    Object.assign(student, req.body);
    student.updatedBy = req.user.id;
    student.updatedAt = new Date();

    await student.save();
    res.status(200).json({ success: true, message: 'Student updated successfully', student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==============================
// @desc    Delete a student
// @route   DELETE /api/students/:id
// @access  Private
// ==============================
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    await student.remove();
    res.status(200).json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent
};
