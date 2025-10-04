const mongoose = require('mongoose');

const { Schema } = mongoose;

const approvalSchema = new Schema(
  {
    approver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
    },
    commentedAt: { type: Date },
    comment: { type: String },
  },
  { _id: false }
);

const expenseSchema = new Schema(
  {
    amount: { type: Number, required: true },
    description: { type: String },
    date: { type: Date, default: Date.now },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    approvals: { type: [approvalSchema], default: [] },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
    },
  },
  { timestamps: true }
);

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
