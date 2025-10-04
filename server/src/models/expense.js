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
    comments: { type: String },
  },
  { _id: false }
);

const expenseSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: 'USD' },
    category: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
    },
    receipt: { type: String }, // URL or path to the receipt file
    receiptFile: { type: Buffer }, // For storing the actual PDF file
    receiptFileName: { type: String }, // Original filename of the receipt
    receiptFileType: { type: String }, // MIME type of the receipt file
    approvals: [approvalSchema],
  },
  { timestamps: true }
);

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
