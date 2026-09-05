const express = require('express');
const Referral = require('../models/Referral');
const Notification = require('../models/Notification');
const JobPosting = require('../models/JobPosting');
const { protect, hrOnly } = require('../middleware/authMiddleware');
const User = require('../models/User');


const router = express.Router();

// POST /api/referrals - employee submits a referral
router.post('/', protect, async (req, res) => {
  try {
    const { candidateName, candidateEmail, resumeLink, jobId } = req.body;

    // The job must exist, be open, AND belong to the same company as the referring employee
    const job = await JobPosting.findOne({ _id: jobId, company: req.user.company });
    if (!job || job.status !== 'open') {
      return res.status(400).json({ message: 'This job is not open for referrals' });
    }

        const referral = await Referral.create({
      candidateName,
      candidateEmail,
      resumeLink,
      jobPosting: jobId,
      referredBy: req.user._id,
      company: req.user.company,
    });

    // Notify every HR user in this company about the new referral
    const hrUsers = await User.find({ company: req.user.company, role: 'hr' });
    await Notification.insertMany(
      hrUsers.map((hr) => ({
        user: hr._id,
        message: `${req.user.name} referred ${candidateName} for ${job.title}`,
        type: 'new_referral',
        link: `/hr`,
        company: req.user.company,
      }))
    );

    res.status(201).json(referral);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/referrals/my - referrals the logged-in user submitted
router.get('/my', protect, async (req, res) => {
  try {
    const referrals = await Referral.find({ referredBy: req.user._id, company: req.user.company })
      .populate('jobPosting', 'title department bonusAmount')
      .sort({ createdAt: -1 });

    res.status(200).json(referrals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/referrals/job/:jobId - HR views referrals for a job, with optional search/filter
router.get('/job/:jobId', protect, hrOnly, async (req, res) => {
  try {
    const { search, status } = req.query;

    const filter = {
      jobPosting: req.params.jobId,
      company: req.user.company,
    };

    if (search) {
      filter.candidateName = { $regex: search, $options: 'i' };
    }

    if (status) {
      filter.status = status;
    }

    const referrals = await Referral.find(filter)
      .populate('referredBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(referrals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH /api/referrals/:id/status - HR updates a referral's status, own company only
router.patch('/:id/status', protect, hrOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const referral = await Referral.findOne({ _id: req.params.id, company: req.user.company });

    if (!referral) {
      return res.status(404).json({ message: 'Referral not found' });
    }

       referral.status = status;
    await referral.save();

    await Notification.create({
      user: referral.referredBy,
      message: `Your referral for ${referral.candidateName} is now: ${status.replace('_', ' ')}`,
      type: 'status_update',
      link: '/employee',
      company: req.user.company,
    });

    res.status(200).json(referral);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH /api/referrals/:id/payout - HR marks the bonus as paid, own company only
router.patch('/:id/payout', protect, hrOnly, async (req, res) => {
  try {
    const referral = await Referral.findOne({ _id: req.params.id, company: req.user.company });

    if (!referral) {
      return res.status(404).json({ message: 'Referral not found' });
    }

    if (referral.status !== 'hired') {
      return res.status(400).json({ message: 'Bonus can only be paid for hired referrals' });
    }

    if (referral.bonusPaid) {
      return res.status(400).json({ message: 'Bonus has already been marked as paid' });
    }

        referral.bonusPaid = true;
    await referral.save();

    const job = await JobPosting.findById(referral.jobPosting);

    await Notification.create({
      user: referral.referredBy,
      message: `Your referral bonus of ₹${job.bonusAmount} for ${referral.candidateName} has been paid!`,
      type: 'payout',
      link: '/employee',
      company: req.user.company,
    });

    res.status(200).json(referral);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;