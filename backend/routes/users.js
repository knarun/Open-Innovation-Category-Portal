const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/verifyToken');

// Sign-up route
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, rollNo, department, labName, labCode, phoneNo } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
      rollNo,
      department,
      labName,
      labCode,
      phoneNo
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(201).json({ token, userId: user._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await User.findOne({ name });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token, userId: user._id, isAdmin: user.isAdmin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.patch('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, rollNo, department, labName, labCode, phoneNo } = req.body;

    if (name) user.name = name;
    if (rollNo) user.rollNo = rollNo;
    if (department) user.department = department;
    if (labName) user.labName = labName;
    if (labCode) user.labCode = labCode;
    if (phoneNo) user.phoneNo = phoneNo;

    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add this test route to users.js
router.post('/test-login', async (req, res) => {
  try {
    // Create a test user if it doesn't exist
    let user = await User.findOne({ email: 'test@example.com' });
    if (!user) {
      const hashedPassword = await bcrypt.hash('testpassword', 10);
      user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
        isAdmin: true
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token, userId: user._id, isAdmin: user.isAdmin });
  } catch (error) {
    console.error('Test login error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
