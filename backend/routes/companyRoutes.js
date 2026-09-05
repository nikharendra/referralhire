const express = require('express');
const Company = require('../models/Company');
const { protect, hrOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/company/me - basic info for everyone, join code only for HR
router.get('/me', protect, async (req, res) => {
  try {
    const company = await Company.findById(req.user.company);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const response = { _id: company._id, name: company.name };

    if (req.user.role === 'hr') {
      response.joinCode = company.joinCode;
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH /api/company/regenerate-code - HR only, invalidates the old code
router.patch('/regenerate-code', protect, hrOnly, async (req, res) => {
  try {
    const company = await Company.findById(req.user.company);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    company.joinCode = await Company.generateUniqueJoinCode();
    await company.save();

    res.status(200).json({ joinCode: company.joinCode });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;