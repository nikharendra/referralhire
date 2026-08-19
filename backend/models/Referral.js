const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  candidateName: {
    type: String,
    required: true,
  },
  candidateEmail: {
    type: String,
    required: true,
  },
  resumeLink: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['submitted', 'under_review', 'interview', 'hired', 'rejected'],
    default: 'submitted',
  },
  bonusPaid: {
    type: Boolean,
    default: false,
  },
  jobPosting: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobPosting',
    required: true,
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Referral', referralSchema);