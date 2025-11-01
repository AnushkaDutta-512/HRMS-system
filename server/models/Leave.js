// server/models/leave.js
const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
    // Renamed from 'userId' to 'user' to match the ref and be consistent with Mongoose conventions
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Refers to the 'User' model
        required: true
    },
    // Renamed from 'type' to 'leaveType' for clarity and consistency
    // Enum values now match the mapped backend field names
    leaveType: {
        type: String,
        enum: ['sickLeave', 'casualLeave', 'earnedLeave'], // These are the actual field names in User.leaveBalance
        required: true
    },
    // Renamed from 'from' to 'startDate' for clarity and consistency
    startDate: {
        type: Date,
        required: true
    },
    // Renamed from 'to' to 'endDate' for clarity and consistency
    endDate: {
        type: Date,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model('Leave', leaveSchema);
