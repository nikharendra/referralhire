const express = require('express');
const JobPosting = require('../models/JobPosting');
const { protect, hrOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/jobs - HR creates a job posting (scoped to their company)
router.post('/', protect, hrOnly, async (req, res) => {
  try {
    const { title, department, description, bonusAmount } = req.body;

    const job = await JobPosting.create({
      title,
      department,
      description,
      bonusAmount,
      postedBy: req.user._id,
      company: req.user.company,
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/jobs - open jobs from the user's company, with optional search/filter
router.get('/', protect, async (req, res) => {
  try {
    const { search, department } = req.query;

    const filter = {
      status: 'open',
      company: req.user.company,
    };

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    if (department) {
      filter.department = department;
    }

    const jobs = await JobPosting.find(filter)
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// PATCH /api/jobs/:id/close - only allow closing a job that belongs to this HR's company
router.patch('/:id/close', protect, hrOnly, async (req, res) => {
  try {
    const job = await JobPosting.findOne({ _id: req.params.id, company: req.user.company });

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