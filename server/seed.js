const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const seedDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hrms';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB for seeding');

    const hashedPassword = await bcrypt.hash('3222321', 10);

    // 1. Admin User
    const adminEmail = 'anudutta885@gmail.com';
    let adminUser = await User.findOne({ email: adminEmail });
    if (!adminUser) {
      adminUser = new User({
        name: 'Anushka Dutta (HR Admin)',
        email: adminEmail,
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
      console.log('✅ Admin user created:', adminEmail);
    } else {
      // Update password to ensure it matches demo password
      adminUser.password = hashedPassword;
      adminUser.role = 'admin';
      await adminUser.save();
      console.log('ℹ️ Admin user already exists, password synced:', adminEmail);
    }

    // 2. Demo Employee User
    const empEmail = 'anushka.23fe10cse00399@muj.manipal.edu';
    let empUser = await User.findOne({ email: empEmail });
    if (!empUser) {
      empUser = new User({
        name: 'Anushka Dutta',
        email: empEmail,
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
      console.log('✅ Employee user created:', empEmail);
    } else {
      empUser.password = hashedPassword;
      empUser.role = 'employee';
      await empUser.save();
      console.log('ℹ️ Employee user already exists, password synced:', empEmail);
    }

    console.log('🎉 Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
};

seedDB();
