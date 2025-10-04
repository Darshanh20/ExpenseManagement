const express = require('express');
const router = express.Router();
const { signupCompanyAndAdmin, loginUser, signupEmployee } = require('../controllers/authController');
const { protect, authorize } = require('../middlewares/auth');

// Public routes
router.post('/signup', signupCompanyAndAdmin);
router.post('/login', loginUser);

// Protected route for admin to create employees
router.post('/signup-employee', protect, authorize('ADMIN'), signupEmployee);

module.exports = router;
