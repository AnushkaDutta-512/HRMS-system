const mongoose = require('mongoose');

const allowanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true }, 
  amount: { type: Number, required: true },
  reason: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  remarks: { type: String },
  createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('AllowanceRequest', allowanceSchema);
