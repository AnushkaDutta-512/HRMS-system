const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

router.post('/mark', async (req, res) => {
  const { userId, name, email } = req.body;
  const today = new Date().toISOString().split('T')[0];

  try {
    const alreadyMarked = await Attendance.findOne({
      $or: [
        { userId: userId, date: today },
        { email: email, date: today }
      ]
    });
    if (alreadyMarked) {
      return res.status(400).json({ msg: 'Attendance already marked for today' });
    }

    const attendance = new Attendance({ userId, name, email, date: today });
    await attendance.save();
    res.status(201).json({ msg: 'Attendance marked successfully', attendance });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to mark attendance', error: err.message });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const records = await Attendance.find({ userId: req.params.userId });
    res.json({ records });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch attendance', error: err.message });
  }
});

router.get('/all', async (req, res) => {
  try {
    const records = await Attendance.find().sort({ date: -1 });
    res.json({ records });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch all attendance', error: err.message });
  }
});

module.exports = router;
