const express = require('express');
const router = express.Router();

const { getApprovalQueue, decideOnExpense, getEmployees } = require('../controllers/managerController');
const { protect, authorize } = require('../middlewares/auth');

// Apply protect and authorize for ADMIN and MANAGER roles
router.use(protect);
router.use(authorize('ADMIN', 'MANAGER'));

router.get('/approvals', getApprovalQueue);
router.put('/approvals/:expenseId', decideOnExpense);
router.get('/employees', getEmployees);

module.exports = router;
