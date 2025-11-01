// server/routes/leave.js
const express = require('express');
const router = express.Router();
const Leave = require('../models/leave');
const User = require('../models/user'); // Import User model to update leave balance
// Import consolidated middleware
const { verifyToken, isAdmin } = require('../middleware/auth');

// Apply for leave
router.post('/apply', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id; // User ID from the token
        const { leaveType, startDate, endDate, reason } = req.body;

        // Find the user to check their current leave balance
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Calculate leave days (inclusive of start and end dates)
        const start = new Date(startDate);
        const end = new Date(endDate);
        const leaveDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

        // Check if the requested leave type exists in user's leave balance
        if (user.leaveBalance[leaveType] === undefined) {
            return res.status(400).json({ message: `Invalid leave type: ${leaveType}` });
        }

        // ✅ Check if user has enough leave balance BEFORE submitting the request
        // This prevents submitting requests for more days than available, but does NOT deduct yet.
        if (user.leaveBalance[leaveType] < leaveDays) {
            return res.status(400).json({
                message: `You don't have enough ${leaveType} left. (${user.leaveBalance[leaveType]} remaining)`
            });
        }

        // Create a new leave request with 'Pending' status
        const leave = new Leave({
            user: userId, // Use 'user' field as defined in Leave model
            leaveType,
            startDate,
            endDate,
            reason,
            status: 'Pending' // Default status is Pending
        });

        await leave.save(); // Save the pending leave request
        res.status(201).json({ message: 'Leave request submitted successfully (Pending approval)', leave });
    } catch (err) {
        console.error('Error applying leave:', err);
        res.status(500).json({ message: 'Error applying leave', error: err.message });
    }
});

// HR approves or rejects leave
router.put('/:id/status', verifyToken, isAdmin, async (req, res) => {
    try {
        const { status } = req.body; // 'Approved' or 'Rejected'
        const leaveId = req.params.id;

        // Populate 'user' to get the associated user's details, including leaveBalance
        const leave = await Leave.findById(leaveId).populate('user');
        if (!leave) {
            return res.status(404).json({ message: 'Leave request not found' });
        }

        // Only allow status change if current status is 'Pending'
        if (leave.status !== 'Pending') {
            return res.status(400).json({ message: `Leave request is already ${leave.status.toLowerCase()}.` });
        }

        const user = leave.user; // User object from populated leave
        if (!user) {
            return res.status(404).json({ message: 'Associated user not found for this leave request.' });
        }

        // Calculate leave days
        const start = new Date(leave.startDate);
        const end = new Date(leave.endDate);
        const leaveDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

        // ✅ Deduct leave days from user's balance ONLY IF the status is 'Approved'
        if (status === 'Approved') {
            if (user.leaveBalance[leave.leaveType] === undefined) {
                return res.status(400).json({ message: `Invalid leave type ${leave.leaveType} for user.` });
            }
            if (user.leaveBalance[leave.leaveType] < leaveDays) {
                // This scenario should ideally not happen if apply route validates correctly,
                // but it's a good safeguard.
                return res.status(400).json({ message: `User does not have enough ${leave.leaveType} for approval.` });
            }
            user.leaveBalance[leave.leaveType] -= leaveDays; // Deduct the leave days
            await user.save(); // Save the updated user document with new balance
        }
        // If status is 'Rejected', no change to leave balance

        leave.status = status; // Update leave request status
        await leave.save(); // Save the updated leave request

        res.json({ message: `Leave request ${status.toLowerCase()} successfully`, leave });
    } catch (err) {
        console.error('Error updating leave status:', err);
        res.status(500).json({ message: 'Error updating leave status', error: err.message });
    }
});

// Get all leaves of logged-in user
router.get('/my', verifyToken, async (req, res) => {
    try {
        const leaves = await Leave.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(leaves);
    } catch (err) {
        console.error('Error fetching user leave history:', err);
        res.status(500).json({ message: 'Error fetching leave history', error: err.message });
    }
});

// HR gets all leave requests
router.get('/all', verifyToken, isAdmin, async (req, res) => {
    try {
        // Populate 'user' field to get user details for HR view
        const leaves = await Leave.find().populate('user', 'name email employeeId').sort({ createdAt: -1 });
        res.json(leaves);
    } catch (err) {
        console.error('Error fetching all leave requests:', err);
        res.status(500).json({ message: 'Error fetching all leaves', error: err.message });
    }
});

// Show available leaves for logged-in user (fetches directly from User model)
router.get('/balance/:userId', verifyToken, async (req, res) => {
    try {
        // Ensure the requested userId matches the authenticated user's ID or is an admin
        if (req.user.id !== req.params.userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized access to leave balance.' });
        }

        const user = await User.findById(req.params.userId).select('leaveBalance');
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // ✅ Return the leaveBalance directly from the User model, which is the current available balance
        res.json({ leaveBalance: user.leaveBalance });
    } catch (err) {
        console.error('Error fetching leave balance:', err);
        res.status(500).json({ message: 'Error fetching balance', error: err.message });
    }
});

module.exports = router;
