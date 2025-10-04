const express = require('express');
const router = express.Router();
const { submitExpense, getMyExpenses } = require('../controllers/expensesController');
const { protect, authorize } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// All expense routes require authentication
router.use(protect);

// Employee routes
router.post('/', authorize('EMPLOYEE'), upload.single('receipt'), submitExpense);
router.get('/my-expenses', authorize('EMPLOYEE'), getMyExpenses);

// Route to get receipt file
router.get('/receipt/:expenseId', protect, async (req, res, next) => {
  try {
    const { Expense } = require('../models');
    const expense = await Expense.findById(req.params.expenseId);
    
    if (!expense || !expense.receiptFile) {
      return res.status(404).json({ message: 'Receipt not found' });
    }
    
    // Check if user is authorized to view this receipt
    if (expense.user.toString() !== req.user._id.toString() && 
        !['ADMIN', 'MANAGER'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized to view this receipt' });
    }
    
    res.set('Content-Type', expense.receiptFileType);
    res.set('Content-Disposition', `inline; filename="${expense.receiptFileName}"`);
    res.send(expense.receiptFile);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
