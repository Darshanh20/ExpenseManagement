const { Expense } = require('../models');

// Get all expenses where the approvals array has a pending approval for this manager
async function getApprovalQueue(req, res, next) {
  try {
    const manager = req.user;
    if (!manager) return res.status(401).json({ message: 'Not authorized' });

    const expenses = await Expense.find({
      approvals: { $elemMatch: { approver: manager._id, status: 'PENDING' } },
    }).sort({ createdAt: -1 });

    res.json({ expenses });
  } catch (err) {
    next(err);
  }
}

// Decide on an expense approval
async function decideOnExpense(req, res, next) {
  try {
    const manager = req.user;
    if (!manager) return res.status(401).json({ message: 'Not authorized' });

    const { expenseId, decision } = req.body; // decision = 'APPROVED' | 'REJECTED'
    if (!expenseId || !decision) return res.status(400).json({ message: 'Missing params' });
    if (!['APPROVED', 'REJECTED'].includes(decision)) return res.status(400).json({ message: 'Invalid decision' });

    const expense = await Expense.findById(expenseId);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    // Find the approval subdoc for this manager
    const approval = expense.approvals.find(a => a.approver.toString() === manager._id.toString());
    if (!approval) return res.status(404).json({ message: 'No approval assigned to you for this expense' });
    if (approval.status !== 'PENDING') return res.status(400).json({ message: 'Approval already decided' });

    approval.status = decision;
    if (decision === 'REJECTED') {
      expense.status = 'REJECTED';
    } else if (decision === 'APPROVED') {
      expense.status = 'APPROVED';
    }

    await expense.save();

    res.json({ expense });
  } catch (err) {
    next(err);
  }
}

module.exports = { getApprovalQueue, decideOnExpense };
