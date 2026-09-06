const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const app = express();
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman) or any localhost / vercel app
    if (!origin || origin.includes("localhost") || origin.includes("127.0.0.1") || origin.includes("vercel.app")) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive CORS for development
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));

app.use(express.json()); 

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

// Ensure static files in uploads are served
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.send('HRMS Backend Running!');
});

const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hrms';
mongoose.connect(mongoURI)
.then(() => console.log('✅ Connected to MongoDB Database'))
.catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('💡 Tip: Please check server/.env MONGO_URI credentials, IP whitelist (0.0.0.0/0), or ensure MongoDB is running.');
});

const PORT = process.env.PORT || 3036; 
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
