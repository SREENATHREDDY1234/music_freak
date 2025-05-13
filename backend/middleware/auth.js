const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');
const User = require('../models/User');

// 1. Verify JWT token
exports.authenticate = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ error: 'Invalid token' });
    
    req.user = user; // Attach user to request
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// 2. Role-based authorization
exports.authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      console.log(`Permission denied for user role: ${req.user.role}`);
      return res.status(403).json({ error: 'Permission denied' });
    }
    next();
  };
};