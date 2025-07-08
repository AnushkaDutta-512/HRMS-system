const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: String,
  dateOfJoining: Date,
  salary: Number,
  profilePic: {
    type: String,
    default: ''
  },
  employeeId: { type: String, unique: true },
  education: String,
  address: String,
  phone: String,
  emergencyContact: String,
  idNumber: String,
  family: [
    {
      name: String,
      relation: String,
      contact: String
    }
  ]
});

module.exports = mongoose.model('User', userSchema);
