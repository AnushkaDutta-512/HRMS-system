const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config();

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin or any localhost / vercel app
    if (!origin || origin.includes("localhost") || origin.includes("127.0.0.1") || origin.includes("vercel.app")) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive CORS for development & production
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));

app.use(express.json());

// Database connection helper for standard and serverless environments
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hrms';
  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log('✅ Connected to MongoDB Database');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('💡 Tip: Please check server/.env MONGO_URI credentials, IP whitelist (0.0.0.0/0), or ensure MongoDB is running.');
  }
};

// Ensure DB is connected before handling API requests
app.use(async (req, res, next) => {
  await connectDB();
  next();
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
    res.json({ message: 'HRMS API is live and operational!' });
});

// Initial DB connect attempt
connectDB();

if (require.main === module || process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3036; 
  app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
  });
}

module.exports = app;
