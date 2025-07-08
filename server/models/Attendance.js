const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  date: { type: String, required: true },
  status: { type: String, enum: ['Present'], default: 'Present' }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
