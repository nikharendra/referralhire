import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StatusBadge from '../components/Badge';

export default function HRDashboard() {
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [jobForm, setJobForm] = useState({ title: '', department: '', description: '', bonusAmount: '' });
  const [selectedJob, setSelectedJob] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  const loadStats = async () => {
    const res = await api.get('/dashboard/stats');
    setStats(res.data);
  };

  const loadJobs = async () => {
    const res = await api.get('/jobs');
    setJobs(res.data);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([loadStats(), loadJobs()]);
      setLoading(false);
    })();
  }, []);

  const handleJobChange = (e) => {
    setJobForm({ ...jobForm, [e.target.name]: e.target.value });
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setPosting(true);
    try {
      await api.post('/jobs', { ...jobForm, bonusAmount: Number(jobForm.bonusAmount) });
      setMessage('Job posted successfully!');
      setJobForm({ title: '', department: '', description: '', bonusAmount: '' });
      loadJobs();
      loadStats();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create job');
    } finally {
      setPosting(false);
    }
  };

  const handleCloseJob = async (jobId) => {
    await api.patch(`/jobs/${jobId}/close`);
    loadJobs();
    loadStats();
  };

  const loadReferralsForJob = async (job) => {
    setSelectedJob(job);
    const res = await api.get(`/referrals/job/${job._id}`);
    setReferrals(res.data);
  };

  const handleStatusChange = async (referralId, status) => {
    await api.patch(`/referrals/${referralId}/status`, { status });
    loadReferralsForJob(selectedJob);
    loadStats();
  };

  const handlePayout = async (referralId) => {
    await api.patch(`/referrals/${referralId}/payout`);
    loadReferralsForJob(selectedJob);
    loadStats();
  };

  return (
    <div className="page">
      <Navbar />
      <div className="container" style={{ paddingTop: 32, paddingBottom: 20 }}>
        <h1>HR Dashboard</h1>
        <p className="text-muted" style={{ marginTop: 4, marginBottom: 24 }}>Manage job postings and track referrals.</p>

        {/* Stats */}
        {stats && (
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginBottom: 32 }}>
            <StatCard label="Open Positions" value={stats.openPositions} color="var(--primary)" />
            <StatCard label="Total Referrals" value={stats.totalReferrals} color="var(--info)" />
            <StatCard label="Hired" value={stats.hiredCount} color="var(--success)" />
            <StatCard label="Pending Payout" value={`₹${stats.pendingPayout}`} color="var(--warning)" />
          </div>
        )}

        {/* Post job + job list */}
        <div className="grid" style={{ gridTemplateColumns: '360px 1fr', alignItems: 'start', marginBottom: 32 }}>
          <div className="card">
            <h3>Post a Job</h3>
            <form onSubmit={handleCreateJob}>
              <div className="field">
                <label>Job title</label>
                <input className="input" name="title" placeholder="Frontend Developer" value={jobForm.title} onChange={handleJobChange} required />
              </div>
              <div className="field">
                <label>Department</label>
                <input className="input" name="department" placeholder="Engineering" value={jobForm.department} onChange={handleJobChange} required />
              </div>
              <div className="field">
                <label>Description</label>
                <textarea className="input" name="description" rows="3" placeholder="Short role description" value={jobForm.description} onChange={handleJobChange} />
              </div>
              <div className="field">
                <label>Referral bonus (₹)</label>
                <input className="input" name="bonusAmount" type="number" placeholder="5000" value={jobForm.bonusAmount} onChange={handleJobChange} required />
              </div>

              {error && <div className="msg-error">{error}</div>}
              {message && <div className="msg-success">{message}</div>}

              <button type="submit" className="btn btn-primary btn-block" disabled={posting}>
                {posting ? 'Posting...' : 'Post Job'}
              </button>
            </form>
          </div>

          <div>
            <h3>Your Job Postings</h3>
            {loading ? (
              <div className="card text-muted">Loading jobs...</div>
            ) : jobs.length === 0 ? (
              <div className="card text-muted">No jobs posted yet — create one on the left.</div>
            ) : (
              <div className="grid" style={{ gap: 12 }}>
                {jobs.map((job) => (
                  <div key={job._id} className="card flex-between" style={{ padding: '16px 20px' }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{job.title}</div>
                      <div className="text-muted" style={{ fontSize: 13 }}>{job.department} · ₹{job.bonusAmount} bonus</div>
                    </div>
                    <div className="flex gap-sm">
                      <button className="btn btn-secondary btn-sm" onClick={() => loadReferralsForJob(job)}>
                        View Referrals
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleCloseJob(job._id)}>
                        Close
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Referrals for selected job */}
        {selectedJob && (
          <div>
            <h3>Referrals — {selectedJob.title}</h3>
            {referrals.length === 0 ? (
              <div className="card text-muted">No referrals for this job yet.</div>
            ) : (
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {referrals.map((ref, i) => (
                  <div
                    key={ref._id}
                    className="flex-between"
                    style={{ padding: '14px 20px', borderTop: i === 0 ? 'none' : '1px solid var(--border)', flexWrap: 'wrap', gap: 10 }}
                  >
                    <div>
                      <div style={{ fontWeight: 600 }}>{ref.candidateName}</div>
                      <div className="text-muted" style={{ fontSize: 13 }}>Referred by {ref.referredBy?.name || 'Unknown'}</div>
                    </div>
                    <div className="flex gap-sm" style={{ alignItems: 'center' }}>
                      <StatusBadge status={ref.status} />
                      <select
                        className="input"
                        style={{ width: 150, padding: '6px 10px', fontSize: 13 }}
                        value={ref.status}
                        onChange={(e) => handleStatusChange(ref._id, e.target.value)}
                      >
                        <option value="submitted">Submitted</option>
                        <option value="under_review">Under Review</option>
                        <option value="interview">Interview</option>
                        <option value="hired">Hired</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      {ref.status === 'hired' && !ref.bonusPaid && (
                        <button className="btn btn-primary btn-sm" onClick={() => handlePayout(ref._id)}>
                          Mark Paid
                        </button>
                      )}
                      {ref.bonusPaid && <span className="badge badge-success">Paid ✓</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="card" style={{ borderTop: `3px solid ${color}` }}>
      <div className="text-muted" style={{ fontSize: 13, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 800 }}>{value}</div>
    </div>
  );
}