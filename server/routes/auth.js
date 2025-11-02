// server/routes/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User_temp");
// Import the centralized middleware
const { verifyToken, isAdmin } = require("../middleware/auth");
const nodemailer = require('nodemailer'); // ✅ Import nodemailer

// ✅ Configure Nodemailer transporter (use environment variables for security)
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true', // Use 'true' for port 465 (SSL), 'false' for other ports like 587 (TLS)
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS  // Your email password or app-specific password
    },
    tls: {
        // Do not fail on invalid certs (useful for local development, but be cautious in production)
        rejectUnauthorized: false
    }
});

// Register a new user (Admin can create employees)
router.post("/register", verifyToken, isAdmin, async (req, res) => {
    try {
        const { email, password, name, role, employeeId, dateOfJoining, salary, education, address, phone, emergencyContact, idNumber, family } = req.body;

        if (!email || !password || !name || !role || !employeeId || !dateOfJoining || !salary) {
            return res.status(400).json({ message: "All required fields (email, password, name, role, employeeId, dateOfJoining, salary) must be provided." });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { employeeId }] });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email or employee ID already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password for storage

        const newUser = new User({
            name, email, password: hashedPassword, role, employeeId, dateOfJoining, salary,
            education, address, phone, emergencyContact, idNumber, family
        });

        await newUser.save();
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: newUser.email,
            subject: 'Welcome to HRMS',
            html: `
                <p>Dear ${newUser.name},</p>
                <p>Welcome to the team ! We are thrilled to have you join us.</p>
                <p>Here are your login credentials for the HRMS portal:</p>
                <ul>
                    <li><strong>Portal URL:</strong> <a href="https://hrms-system-rose.vercel.app">https://hrms-system-rose.vercel.app/</a></li>
                    <li><strong>Your Employee ID:</strong> ${newUser.employeeId}</li>
                    <li><strong>Your Login Email:</strong> ${newUser.email}</li>
                    <li><strong>Temporary Password:</strong> ${password}</li> 
                </ul>
                <p><strong>Important:</strong> For security reasons, please log in and change your password immediately after your first login.</p>
                <p>If you have any questions, please contact the HR department.</p>
                <p>Best regards,<br>The HR Department</p>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('❌ Error sending welcome email:', error);
            } else {
                console.log('✅ Welcome email sent:', info.response);
            }
        });
        res.status(201).json({
            message: "User created successfully and credentials emailed.",
            credentials: { 
                email: newUser.email,
                employeeId: newUser.employeeId
            }
        });
    } catch (err) {
        console.error("Error during user registration:", err);
        res.status(500).json({ message: err.message || "Internal server error during registration" });
    }
});
// Register a new user (can be extended for admin to create employees)

// Login user
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Login attempt for:", email);

        const user = await User.findOne({ email });
        if (!user) {
            console.log("❌ No user found with email:", email);
            return res.status(400).json({ message: "Invalid credentials." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("❌ Password does not match for:", email);
            return res.status(400).json({ message: "Invalid credentials." });
        }

        // Generate JWT token with user id, role, and email
        const token = jwt.sign(
            { id: user._id, role: user.role, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" } // Token expires in 1 day
        );

        console.log("✅ Login successful for:", user.email);

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                // Include leaveBalance in the user object sent to frontend for immediate access
                leaveBalance: user.leaveBalance
            }
        });
    } catch (err) {
        console.error("🔥 ERROR during login:", err.message);
        res.status(500).json({ message: "Server error during login.", error: err.message });
    }
});

// Get all employees (admin only)
router.get("/employees", verifyToken, isAdmin, async (req, res) => {
    try {
        // Fetch all users with role 'employee' and exclude their passwords
        const employees = await User.find({ role: "employee" }).select("-password");
        res.json(employees);
    } catch (err) {
        console.error("Error fetching employees:", err.message);
        res.status(500).json({ message: "Server error fetching employees.", error: err.message });
    }
});

// Get current user's profile
router.get("/me", verifyToken, async (req, res) => {
    try {
        // Find user by ID from the token and exclude password
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.json(user);
    } catch (err) {
        console.error("Error fetching current user profile:", err.message);
        res.status(500).json({ message: "Server error fetching user profile.", error: err.message });
    }
});

// Change password for logged-in user
router.post("/change-password", verifyToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Compare current password with stored hashed password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect." });
        }

        // Hash the new password and save it
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();

        res.json({ message: "Password changed successfully." });
    } catch (err) {
        console.error("Error changing password:", err.message);
        res.status(500).json({ message: "Server error changing password.", error: err.message });
    }
});

// Delete employee (admin only)
router.delete("/employee/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        // Find and delete user by ID
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: "Employee not found." });
        }
        res.json({ message: "Employee deleted successfully." });
    } catch (err) {
        console.error("Error deleting employee:", err.message);
        res.status(500).json({ message: "Server error deleting employee.", error: err.message });
    }
});

module.exports = router;
// No longer exporting middleware here, as they are centralized in server/middleware/auth.js
