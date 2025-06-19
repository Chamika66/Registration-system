const express = require('express');
const router = express.Router();

const {
    createStudent, 
    getAllStudents, 
    getStudentById, 
    updateStudent, 
    deleteStudent
} = require('../Controllers/studentController');

const authMiddleware = require('../Middleware/authMiddleware');
const upload = require('../Middleware/uploadMiddleware');

router.use(authMiddleware);
router.post('/',upload.single('photograph'), createStudent);
router.get('/', getAllStudents);
router.get('/:id', getStudentById);
router.put('/:id',upload.single('photograph'), updateStudent);
router.delete('/:id', deleteStudent);

module.exports = router;