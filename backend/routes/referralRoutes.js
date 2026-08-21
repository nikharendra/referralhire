const express = require('express');
const Referral = require('../models/Referral');
const JobPosting = require('../models/JobPosting');
const { protect, hrOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/referrals - employee submits a referral
router.post('/', protect, async (req, res) => {
  try {
    const { candidateName, candidateEmail, resumeLink, jobId } = req.body;

    const job = await JobPosting.findById(jobId);
    if (!job || job.status !== 'open') {
      return res.status(400).json({ message: 'This job is not open for referrals' });
    }

    const referral = await Referral.create({
      candidateName,
      candidateEmail,
      resumeLink,
      jobPosting: jobId,
      referredBy: req.user._id,
    });

    res.status(201).json(referral);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/referrals/my - referrals the logged-in user submitted
router.get('/my', protect, async (req, res) => {
  try {
    const referrals = await Referral.find({ referredBy: req.user._id })
      .populate('jobPosting', 'title department bonusAmount')
      .sort({ createdAt: -1 });

    res.status(200).json(referrals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/referrals/job/:jobId - HR views all referrals for a job
router.get('/job/:jobId', protect, hrOnly, async (req, res) => {
  try {
    const referrals = await Referral.find({ jobPosting: req.params.jobId })
      .populate('referredBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(referrals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH /api/referrals/:id/status - HR updates referral status
router.patch('/:id/status', protect, hrOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const referral = await Referral.findById(req.params.id);

    if (!referral) {
      return res.status(404).json({ message: 'Referral not found' });
    }

    referral.status = status;
    await referral.save();

    res.status(200).json(referral);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH /api/referrals/:id/payout - HR marks the bonus as paid
router.patch('/:id/payout', protect, hrOnly, async (req, res) => {
  try {
    const referral = await Referral.findById(req.params.id);

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

    res.status(200).json(referral);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;