const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    // Log the incoming request
    console.log('Verifying token for request:', req.method, req.path);
    // console.log('Headers:', req.headers);

    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log('Decoded token:', decoded);

    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      // console.log('User not found for token:', decoded);
      return res.status(401).json({ message: 'User not found' });
    }

    // Set user info
    req.user = {
      id: user._id,
      isAdmin: user.isAdmin,
      email: user.email
    };
    // console.log('User authenticated:', req.user);

    next();
  } catch (err) {
    console.error('Token verification error:', err);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};
