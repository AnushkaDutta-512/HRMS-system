const mongoose = require('mongoose');

const salarySlipSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: false,
  },
  basicPay: {
    type: Number,
    required: true,
  },
  allowances: {
    type: Number,
    required: true,
  },
  deductions: {
    type: Number,
    required: true,
  },
  netSalary: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

// ✅ Prevent OverwriteModelError
module.exports = mongoose.models.SalarySlip || mongoose.model('SalarySlip', salarySlipSchema);
