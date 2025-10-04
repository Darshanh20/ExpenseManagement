// Expense controller backed by Mongoose
const { Expense, User } = require('../models');

// Employee submits an expense
async function submitExpense(req, res, next) {
  try {
    const user = req.user; // expect protect middleware
    if (!user) return res.status(401).json({ message: 'Not authorized' });

    const { amount, description, date, category, receipt } = req.body;
    if (!amount) return res.status(400).json({ message: 'Amount is required' });
    
    // Create the expense object with basic fields
    const expenseData = {
      amount,
      description,
      date,
      category: category || 'other',
      user: user._id,
      currency: 'USD', // Default currency
    };
    
    // Handle receipt file if it exists in the request
    if (req.file) {
      expenseData.receiptFile = req.file.buffer;
      expenseData.receiptFileName = req.file.originalname;
      expenseData.receiptFileType = req.file.mimetype;
    } else if (receipt) {
      // If no file but a receipt URL is provided
      expenseData.receipt = receipt;
    }

    const expense = await Expense.create(expenseData);

    // If user has a manager, create the first approval for them
    if (user.manager) {
      expense.approvals.push({ approver: user.manager });
      await expense.save();
    }

    res.status(201).json({ expense });
  } catch (err) {
    console.error('Error submitting expense:', err);
    next(err);
  }
}

// Get all expenses for the logged-in user
async function getMyExpenses(req, res, next) {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Not authorized' });

    const expenses = await Expense.find({ user: user._id }).sort({ createdAt: -1 });
    res.json({ expenses });
  } catch (err) {
    next(err);
  }
}

module.exports = { submitExpense, getMyExpenses };
