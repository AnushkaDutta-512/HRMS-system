const jwt = require("jsonwebtoken");
const User = require("../models/user"); 
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Access denied. No token provided or malformed." });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next(); 
    } catch (err) {
        console.error("JWT verification failed:", err.message);
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next(); 
};

module.exports = {
    verifyToken,
    isAdmin
};

