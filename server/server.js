const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', require('./routes/auth'));



app.use('/api/auth', require('./routes/auth'));

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const allowanceRoutes = require('./routes/allowance');
app.use('/api/allowance', allowanceRoutes);

const salaryRoutes = require('./routes/salary');
app.use('/api/salary', salaryRoutes);

const leaveRoutes = require('./routes/leave');
app.use('/api/leave', leaveRoutes);

const attendanceRoutes = require('./routes/attendance');
app.use('/api/attendance', attendanceRoutes);


const profileRoutes = require('./routes/profile');
app.use('/api/employees', profileRoutes); // 🔁 changed
app.use('/api/profile', profileRoutes);


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Base check route
app.get('/', (req, res) => {
  res.send('HRMS Backend Running ');
});


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

const PORT = process.env.PORT || 3036;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
