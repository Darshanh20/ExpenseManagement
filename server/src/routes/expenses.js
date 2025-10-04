const express = require('express');
const router = express.Router();
const { submitExpense, getMyExpenses } = require('../controllers/expensesController');
const { protect, authorize } = require('../middlewares/auth');

// All expense routes require authentication
router.use(protect);

// Employee routes
router.post('/', authorize('EMPLOYEE'), submitExpense);
router.get('/my-expenses', authorize('EMPLOYEE'), getMyExpenses);

module.exports = router;
