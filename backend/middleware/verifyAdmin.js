const User = require('../models/User');

module.exports = async (req, res, next) => {
  try { 
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
  } catch (err) {
    console.error('verifyAdmin error:', err);
    res.status(500).json({ message: 'Server error in admin verification' });
  }
};
