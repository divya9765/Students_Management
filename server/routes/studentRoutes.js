const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
    getStudents,
    setStudent,
    updateStudent,
    deleteStudent,
    getStats
} = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only images are allowed'));
    }
});

router.route('/')
    .get(protect, getStudents)
    .post(protect, upload.single('profileImage'), setStudent);

router.route('/stats')
    .get(protect, getStats);

router.route('/:id')
    .put(protect, upload.single('profileImage'), updateStudent)
    .delete(protect, deleteStudent);

module.exports = router;
