const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config();

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    // Permissive CORS for development & production (Vercel, custom domains, localhost)
    callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));

app.use(express.json());

// Auto-seed initial demo users if database is empty (useful for fresh MongoDB Atlas deployments)
const autoSeedInitialData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Empty database detected. Auto-seeding initial admin and demo employee users...');
      const hashedPassword = await bcrypt.hash('3222321', 10);
      
      const adminUser = new User({
        name: 'Anushka Dutta (HR Admin)',
        email: 'anudutta885@gmail.com',
        password: hashedPassword,
        role: 'admin',
        employeeId: 'ADM-001',
        dateOfJoining: new Date('2023-01-15'),
        salary: 85000,
        education: 'B.Tech in Computer Science & Engineering',
        address: 'Jaipur, Rajasthan, India',
        phone: '+91 98765 43210',
        emergencyContact: '+91 98765 43211',
        idNumber: 'GOV-HR-99881',
        family: [
          { name: 'S. Dutta', relation: 'Father', contact: '+91 98765 43212' }
        ],
        leaveBalance: { sickLeave: 10, casualLeave: 10, earnedLeave: 20 }
      });
      await adminUser.save();

      const empUser = new User({
        name: 'Anushka Dutta',
        email: 'anushka.23fe10cse00399@muj.manipal.edu',
        password: hashedPassword,
        role: 'employee',
        employeeId: 'EMP-1024',
        dateOfJoining: new Date('2024-06-01'),
        salary: 45000,
        education: 'B.Tech CSE - MUJ',
        address: 'Manipal University Campus, Jaipur',
        phone: '+91 91234 56789',
        emergencyContact: '+91 91234 56780',
        idNumber: 'MUJ-EMP-00399',
        family: [
          { name: 'M. Dutta', relation: 'Mother', contact: '+91 91234 56781' }
        ],
        leaveBalance: { sickLeave: 6, casualLeave: 6, earnedLeave: 12 }
      });
      await empUser.save();
      console.log('✅ Initial admin and demo employee auto-seeded successfully!');
    }
  } catch (seedErr) {
    console.error('⚠️ Auto-seed error (non-fatal):', seedErr.message);
  }
};

let dbConnectionPromise = null;

// Database connection helper for standard and serverless environments
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  if (dbConnectionPromise) {
    return dbConnectionPromise;
  }
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hrms';
  dbConnectionPromise = mongoose.connect(mongoURI, {
    serverSelectionTimeoutMS: 8000,
  }).then(async () => {
    console.log('✅ Connected to MongoDB Database');
    await autoSeedInitialData();
  }).catch((err) => {
    dbConnectionPromise = null;
    console.error('❌ MongoDB connection error:', err.message);
    throw err;
  });

  return dbConnectionPromise;
};

// Ensure DB is connected before handling API requests
app.use(async (req, res, next) => {
  if (req.path === '/' || req.path === '/api' || req.path === '/api/health') {
    return next();
  }
  try {
    await connectDB();
    next();
  } catch (err) {
    return res.status(503).json({
      message: 'Database connection error. Please ensure MONGO_URI is configured in your deployment environment variables and IP 0.0.0.0/0 is whitelisted in MongoDB Atlas.',
      error: err.message
    });
  }
});

const authRoutes = require('./routes/auth');
const allowanceRoutes = require('./routes/allowance'); 
const salaryRoutes = require('./routes/salary');    
const leaveRoutes = require('./routes/leave');
const attendanceRoutes = require('./routes/attendance'); 
const profileRoutes = require('./routes/profile');   

app.use('/api/auth', authRoutes);
app.use('/api/allowance', allowanceRoutes);
app.use('/api/salary', salaryRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/employees', profileRoutes);
app.use('/api/profile', profileRoutes);

// Serve static files in uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.send('HRMS Backend Running!');
});

app.get('/api', (req, res) => {
    res.json({ message: 'HRMS API is live and operational!', dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date(), dbReadyState: mongoose.connection.readyState });
});

// Initial DB connect attempt
connectDB().catch((err) => {
  console.error('⚠️ Initial DB connect caught:', err.message);
});

if (require.main === module || process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3036; 
  const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Server is running on port ${PORT} at http://localhost:${PORT}`);
  });
}

module.exports = app;

