const express = require('express');
const JobPosting = require('../models/JobPosting');
const Referral = require('../models/Referral');
const { protect, hrOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/dashboard/stats - HR dashboard summary, scoped to their own company
router.get('/stats', protect, hrOnly, async (req, res) => {
  try {
    const companyId = req.user.company;

    const openPositions = await JobPosting.countDocuments({ status: 'open', company: companyId });
    const totalReferrals = await Referral.countDocuments({ company: companyId });
    const hiredCount = await Referral.countDocuments({ status: 'hired', company: companyId });

    const pendingPayoutAgg = await Referral.aggregate([
      { $match: { status: 'hired', bonusPaid: false, company: companyId } },
      {
        $lookup: {
          from: 'jobpostings',
          localField: 'jobPosting',
          foreignField: '_id',
          as: 'job',
        },
      },
      { $unwind: '$job' },
      {
        $group: {
          _id: null,
          totalPending: { $sum: '$job.bonusAmount' },
        },
      },
    ]);

    const pendingPayout = pendingPayoutAgg.length > 0 ? pendingPayoutAgg[0].totalPending : 0;

    res.status(200).json({
      openPositions,
      totalReferrals,
      hiredCount,
      pendingPayout,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;