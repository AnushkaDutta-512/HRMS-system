const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ msg: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ msg: 'Invalid token' });
    req.user = decoded;
    next();
  });
}

function isAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ msg: 'Access denied' });
  }
  next();
}

function generateEmployeeId() {
  return 'EMP' + Math.floor(100000 + Math.random() * 900000);
}

router.post('/register', async (req, res) => {
  const { name, email, password, role, dateOfJoining, salary } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      dateOfJoining,
      salary
    });

    await user.save();
    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        dateOfJoining: user.dateOfJoining,
        salary: user.salary,
        profilePic: user.profilePic || '',
        employeeId: user.employeeId || ''
      }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

router.get('/employees', async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' }).select('-password');
    res.json({ employees });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch employees', error: err.message });
  }
});


router.get('/employee/:id', async (req, res) => {
  try {
    const employee = await User.findById(req.params.id).select('-password');
    if (!employee) return res.status(404).json({ msg: 'User not found' });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ msg: 'Error', error: err.message });
  }
});

router.get('/test', (req, res) => {
  res.send('✅ Auth route working');
});


router.post('/create-employee', verifyToken, isAdmin, async (req, res) => {
  try {
    const {
  name,
  email,
  role,
  dateOfJoining,
  salary,
  education,
  address,
  phone,
  emergencyContact,
  family,
  idNumber
} = req.body;


    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'User already exists' });

    const password = Math.random().toString(36).slice(-8); // temp password
    const hashedPassword = await bcrypt.hash(password, 10);
    const employeeId = generateEmployeeId();

    const newUser = new User({
  name,
  email,
  password: hashedPassword,
  role: role || 'employee',
  dateOfJoining,
  salary,
  education,
  address,
  phone,
  emergencyContact,
  family,
  idNumber,
  employeeId
});


    await newUser.save();

    const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,   
    pass: process.env.EMAIL_PASS    
  }
});


const mailOptions = {
  from: '"HRMS System" <your-email@gmail.com>',
  to: email, 
  subject: 'Welcome to the Company - Your Login Credentials',
  html: `
    <h3>Hi ${name},</h3>
    <p>Your account has been created successfully. Please find your login credentials below:</p>
    <ul>
      <li><strong>Email:</strong> ${email}</li>
      <li><strong>Password:</strong> ${password}</li>
      <li><strong>Employee ID:</strong> ${employeeId}</li>
    </ul>
    <p>You can log in at: <a href="http://localhost:3000">HRMS Portal</a></p>
    <p><em>We recommend changing your password after first login.</em></p>
    <br />
    <p>Regards,<br/>HR Team</p>
  `
};

await transporter.sendMail(mailOptions);


    res.status(201).json({
      msg: 'Employee created successfully',
      credentials: {
        email,
        password, 
        employeeId
      }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Error creating employee', error: err.message });
  }
});

module.exports = router;
