const express = require('express');
const multer = require('multer');
const path = require('path');
const User = require('../models/user');
const SalarySlip = require('../models/SalarySlip');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profile-pics');
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
    cb(new Error('Only .jpg, .jpeg, .png, .webp files are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB limit
});


router.post('/upload/:userId', upload.single('profilePic'), async (req, res) => {
  try {
    console.log('✅ Upload route hit');
    console.log('📦 File received:', req.file);

    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      console.error('❌ User not found in DB');
      return res.status(404).json({ msg: 'User not found' });
    }

    console.log('✅ User found:', user.email);

    user.profilePic = `profile-pics/${req.file.filename}`;
    await user.save();

    res.json({ msg: '✅ Profile picture uploaded', filename: req.file.filename });
  } catch (err) {
    console.error('❌ Upload failed on server:', err);
    res.status(500).json({ msg: 'Upload failed', error: err.message });
  }
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
    console.log("📄 Enriched Users with Slips:", JSON.stringify(enriched, null, 2));


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
