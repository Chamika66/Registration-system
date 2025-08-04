const express = require('express');
const router = express.Router();

const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getDashboardStats,
  searchStudentsByName
} = require('../Controllers/studentController');

const {authMiddleware} = require('../Middleware/authMiddleware');
const upload = require('../Middleware/uploadMiddleware');

console.log('authMiddleware:', typeof authMiddleware);
console.log('upload:', typeof upload);

// Apply only authMiddleware globally
router.use(authMiddleware);

// Apply multer per route only when file is uploaded
router.post('/',authMiddleware, upload.single('photograph'), createStudent);
router.get('/', getAllStudents);
router.get('/stats', getDashboardStats);
router.get('/:id', getStudentById);
router.put('/:id', authMiddleware, upload.single('photograph'), updateStudent);
router.delete('/:id',authMiddleware, deleteStudent);
router.get("/search", authMiddleware, searchStudentsByName);


module.exports = router;
