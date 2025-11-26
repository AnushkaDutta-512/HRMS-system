# 🧑‍💼 HRMS System – Human Resource Management Portal

A full-stack **Human Resource Management System** (HRMS) designed for internal employee management by HR/admins.

This web app allows employees to mark attendance, apply for leave, and for HR to manage users, approve leaves, and send login credentials securely via email.

---
🔐 Demo Login Credentials
-Admin Login
 Email	anudutta885@gmail.com
 Password	3222321
 -Employee Login
 Email	anushka.23fe10cse00399@muj.manipal.edu
 Password	3222321

## 🚀 Features

### 👩‍💼 Employee Portal
- ✅ Login with JWT Authentication
- 🕒 Mark Attendance (one click)
- 📝 Apply for Leave
- 📄 View Leave Status

### 🛠️ Admin/HR Portal
- 👥 Add/Edit/Delete Employee Users
- 📩 Send login credentials via **NodeMailer**
- 🔑 Generate random secure password for each new user
- ✅ Approve or reject leave requests
- 📅 View all attendance records

---

## 🧰 Tech Stack

| Frontend                | Backend                   | Others                     |
|------------------------|---------------------------|----------------------------|
| React (CRA)            | Node.js + Express.js      | JWT Authentication         |
| Tailwind CSS           | MongoDB (Mongoose ODM)    | NodeMailer (email service) |
| React Router DOM       | bcrypt.js (password hash) | dotenv (.env)              |

