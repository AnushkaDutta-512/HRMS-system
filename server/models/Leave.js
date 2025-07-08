const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true }, 
  email: { type: String, required: true },
  type: { type: String, required: true }, 
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Leave', leaveSchema);
