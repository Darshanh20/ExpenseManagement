const express = require('express');
const router = express.Router();

const { getUsers, createUser, assignManager } = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/auth');

// Apply protect and authorize to all routes in this router
router.use(protect);
router.use(authorize('ADMIN'));

// User management routes
router.get('/users', getUsers);
router.post('/users', createUser);
router.put('/users/assign-manager', assignManager);

module.exports = router;
