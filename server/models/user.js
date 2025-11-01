// server/models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Added required for essential fields
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'employee'], default: 'employee' }, // Standardized roles
    dateOfJoining: { type: Date, default: Date.now }, // Default to current date
    salary: { type: Number, default: 0 },
    bonus: {
        type: Number,
        default: 0
    },
    profilePic: {
        type: String,
        default: ''
    },
    employeeId: { type: String, unique: true, required: true }, // Added required
    education: { type: String, default: '' },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    emergencyContact: { type: String, default: '' },
    idNumber: { type: String, default: '' },
    family: [
        {
            name: { type: String, required: true },
            relation: { type: String, required: true },
            contact: { type: String, required: true }
        }
    ],
    // leaveBalance now represents the CURRENT available leaves for the user.
    // Initial defaults are set here, and will be decremented upon leave approval.
    leaveBalance: {
        sickLeave: { type: Number, default: 6 },
        casualLeave: { type: Number, default: 6 },
        earnedLeave: { type: Number, default: 12 }
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// This line ensures it doesn't throw OverwriteModelError in development when hot-reloading
module.exports = mongoose.models.User || mongoose.model('User', userSchema);
