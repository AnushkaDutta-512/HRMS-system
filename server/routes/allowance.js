// server/routes/allowance.js
const express = require('express');
const router = express.Router();
const AllowanceRequest = require('../models/AllowanceRequest');
const multer = require('multer');
const path = require('path');
// ✅ Import authentication and authorization middleware
const { verifyToken, isAdmin } = require('../middleware/auth');

// Multer storage configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Ensure 'uploads/' directory exists in your server root
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Create a unique filename to prevent collisions
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// ✅ GET all allowance requests (Admin only) - Protected by verifyToken and isAdmin
router.get('/all', verifyToken, isAdmin, async (req, res) => {
    try {
        const requests = await AllowanceRequest.find()
            // ✅ Populate userId and select name, email, AND employeeId
            .populate('userId', 'name email employeeId')
            .sort({ createdAt: -1 }); // Sort by newest first

        res.json(requests);
    } catch (err) {
        console.error('❌ Error fetching allowance requests:', err);
        // ✅ Use consistent error response format
        res.status(500).json({ message: 'Error fetching allowance requests', error: err.message });
    }
});

// ✅ POST apply for allowance (Authenticated employee/user) - Protected by verifyToken
router.post('/apply', verifyToken, upload.array('proofFiles', 10), async (req, res) => {
    try {
        // userId should come from the token for security, not directly from req.body
        const userId = req.user.id; // ✅ Get userId from the authenticated user's token
        const { amount, type, reason } = req.body;

        // Map uploaded file information to an array of filenames
        const uploadedFiles = req.files ? req.files.map(file => file.filename) : [];

        const newRequest = new AllowanceRequest({
            userId, // Use userId from token
            amount,
            type,
            reason,
            proofFiles: uploadedFiles,
            status: 'pending' // Default status
        });

        await newRequest.save();
        // ✅ Use consistent success message format
        res.status(201).json({ message: '✅ Allowance request submitted successfully', newRequest });
    } catch (err) {
        console.error('❌ Error submitting allowance request:', err);
        // ✅ Use consistent error response format
        res.status(500).json({ message: 'Error submitting allowance request', error: err.message });
    }
});

// ✅ PUT update allowance request status (Admin only) - Protected by verifyToken and isAdmin
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
    const { status, remarks } = req.body; // status: 'approved' or 'rejected'

    try {
        const allowance = await AllowanceRequest.findById(req.params.id);

        if (!allowance) {
            return res.status(404).json({ message: 'Allowance request not found.' });
        }

        // Only allow status change if it's currently 'pending'
        if (allowance.status !== 'pending') {
            return res.status(400).json({ message: `Allowance request is already ${allowance.status}.` });
        }

        // Update the status and remarks
        allowance.status = status;
        allowance.remarks = remarks;

        await allowance.save(); // Save the updated allowance request

        // ✅ Use consistent success message format
        res.json({ message: '✅ Status updated successfully', allowance });
    } catch (err) {
        console.error('❌ Error updating status:', err);
        // ✅ Use consistent error response format
        res.status(500).json({ message: 'Update failed', error: err.message });
    }
});

module.exports = router;
