// server/models/AllowanceRequest.js
const mongoose = require('mongoose');

const allowanceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // References the 'User' model
        required: true
    },
    type: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    reason: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    remarks: {
        type: String
    },
    proofFiles: [{
        type: String
    }], 
}, { timestamps: true }); 
module.exports = mongoose.model('AllowanceRequest', allowanceSchema);
