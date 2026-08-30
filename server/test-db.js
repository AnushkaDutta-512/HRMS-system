require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing connection to MONGO_URI:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('✅ MongoDB connection SUCCESS!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection ERROR:', err.message);
    process.exit(1);
  });
