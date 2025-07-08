const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const SalarySlip = require('../models/SalarySlip');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
router.post('/upload', upload.single('slip'), async (req, res) => {
  try {
    console.log('📩 Incoming upload request');
    console.log('📦 req.body:', req.body);
    console.log('📎 req.file:', req.file);

    const { userId, month } = req.body;
    const mongoose = require('mongoose');

    if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ msg: 'Invalid user ID format' });
    }


    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    const slip = new SalarySlip({
      userId,
      month,
      filePath: req.file.filename
    });

    await slip.save();
    res.status(201).json({ msg: 'Slip uploaded', slip });
  } catch (err) {
    console.error('❌ Upload error:', err); 
    res.status(500).json({ msg: 'Upload failed', error: err.message });
  }
});
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const slips = await SalarySlip.find({ userId });
    res.json({ slips });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch slips', error: err.message });
  }
});


module.exports = router;
