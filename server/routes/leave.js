const express = require('express');
const router = express.Router();
const Leave = require('../models/Leave');


router.post('/apply', async (req, res) => {
  const { userId, name, email, type, fromDate, toDate, reason } = req.body;
  try {
    const leave = new Leave({ userId, name, email, type, fromDate, toDate, reason });
    await leave.save();
    res.status(201).json({ msg: 'Leave applied successfully', leave });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to apply leave', error: err.message });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const leaves = await Leave.find({ userId: req.params.userId });
    res.json({ leaves });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch leaves', error: err.message });
  }
});


router.get('/all', async (req, res) => {
  try {
    const leaves = await Leave.find().sort({ createdAt: -1 });
    res.json({ leaves });
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching leave records' });
  }
});

router.put('/update/:id', async (req, res) => {
  try {
    const updated = await Leave.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json({ msg: 'Leave updated', leave: updated });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to update leave', error: err.message });
  }
});

module.exports = router;
