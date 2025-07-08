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
    required: true,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('SalarySlip', salarySlipSchema);
