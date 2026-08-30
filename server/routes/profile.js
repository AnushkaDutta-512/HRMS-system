const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const SalarySlip = require('../models/SalarySlip');
const router = express.Router();

const profilePicsDir = path.join(__dirname, '../uploads/profile-pics');
if (!fs.existsSync(profilePicsDir)) {
  fs.mkdirSync(profilePicsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, profilePicsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('INVALID_FILE_TYPE'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
}).single('profilePic');

router.post('/upload/:userId', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      if (err.message === 'INVALID_FILE_TYPE') {
        return res.status(400).json({ msg: 'Invalid file format. Only JPG, PNG, and WEBP image files are allowed.' });
      }
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ msg: 'File size too large. Maximum allowed size is 5MB.' });
      }
      return res.status(400).json({ msg: err.message || 'Error uploading file' });
    }

    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded. Please select a valid image file.' });
    }

    try {
      const userId = req.params.userId;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }

      user.profilePic = `profile-pics/${req.file.filename}`;
      await user.save();

      res.json({ msg: 'Profile picture uploaded successfully', filename: req.file.filename });
    } catch (dbErr) {
      console.error('❌ Database update failed:', dbErr);
      res.status(500).json({ msg: 'Failed to update profile record in database' });
    }
  });
});

router.get('/all', async (req, res) => {
  try {
    const users = await User.find();

    const enriched = await Promise.all(
      users.map(async (user) => {
        const slips = await SalarySlip.find({ userId: user._id || user.id }).lean();
        return {
          ...user.toObject(),
          slips: slips.map((s) => ({
            filePath: s.filePath,
            month: s.month,
            year: s.year
          }))
        };
      })
    );

    res.json(enriched);
  } catch (error) {
    console.error('❌ Error in /api/employees/all:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ msg: 'Employee not found' });
    }

    res.json({ msg: '✅ Employee updated', user: updatedUser });
  } catch (error) {
    console.error('❌ Error updating employee:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await User.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ msg: 'Employee not found' });
    }

    res.json({ msg: '✅ Employee deleted' });
  } catch (error) {
    console.error('❌ Error deleting employee:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
