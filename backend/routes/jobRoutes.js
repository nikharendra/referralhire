const express = require('express');
const JobPosting = require('../models/JobPosting');
const { protect, hrOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/jobs - HR creates a job posting
router.post('/', protect, hrOnly, async (req, res) => {
  try {
    const { title, department, description, bonusAmount } = req.body;

    const job = await JobPosting.create({
      title,
      department,
      description,
      bonusAmount,
      postedBy: req.user._id,
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/jobs - anyone logged in can view open jobs
router.get('/', protect, async (req, res) => {
  try {
    const jobs = await JobPosting.find({ status: 'open' })
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH /api/jobs/:id/close - HR closes a job posting
router.patch('/:id/close', protect, hrOnly, async (req, res) => {
  try {
    const job = await JobPosting.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job posting not found' });
    }

    job.status = 'closed';
    await job.save();

    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;