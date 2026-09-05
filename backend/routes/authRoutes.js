const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Company = require('../models/Company');
const crypto = require('crypto');
const router = express.Router();

// Helper to create a token for a given user id
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role, companyAction, companyName, joinCode } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    let company;

    if (role === 'hr' && companyAction === 'create') {
      if (!companyName) {
        return res.status(400).json({ message: 'Company name is required to create a new company' });
      }
      const code = await Company.generateUniqueJoinCode();
      company = await Company.create({ name: companyName, joinCode: code, createdBy: null });
    } else {
      // Both employees, and HR choosing to join, need a valid join code
      if (!joinCode) {
        return res.status(400).json({ message: 'Join code is required' });
      }
      company = await Company.findOne({ joinCode: joinCode.toUpperCase() });
      if (!company) {
        return res.status(400).json({ message: 'Invalid join code' });
      }
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      company: company._id,
    });

    // If this user just created the company, now that we have their _id, set them as its creator
    if (role === 'hr' && companyAction === 'create') {
      company.createdBy = user._id;
      await company.save();
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      company: { _id: company._id, name: company.name, joinCode: company.joinCode },
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      // Same response either way — don't reveal whether an email exists
      return res.status(200).json({ message: 'If that email exists, a reset link has been generated.' });
    }

    // Generate a raw token to send to the user, but store only its hash
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${rawToken}`;

    // Dev-friendly: log it and return it directly instead of emailing
    console.log('Password reset link:', resetLink);

    res.status(200).json({
      message: 'If that email exists, a reset link has been generated.',
      resetLink, // remove this field once real email sending is added
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/auth/reset-password/:token
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { password } = req.body;
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Reset link is invalid or has expired' });
    }

    user.password = password; // pre('save') hook hashes this automatically
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful. You can now log in.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const { protect } = require('../middleware/authMiddleware');

router.get('/me', protect, (req, res) => {
  res.json(req.user);
});

module.exports = router;