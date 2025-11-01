const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); 
const path = require('path');
const app = express();
app.use(cors({
  origin: [
    "https://hrms-system-rose.vercel.app", 
    "http://localhost:3000"               
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/', (req, res) => {
    res.send('HRMS Backend Running!');
});

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));
const PORT = process.env.PORT || 3036; 
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
