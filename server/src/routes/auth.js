const express = require('express');
const router = express.Router();
const { signupCompanyAndAdmin, loginUser } = require('../controllers/authController');

router.post('/signup', signupCompanyAndAdmin);
router.post('/login', loginUser);

module.exports = router;
