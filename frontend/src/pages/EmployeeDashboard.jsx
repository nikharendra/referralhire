import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StatusBadge from '../components/Badge';

export default function EmployeeDashboard() {
  const [jobs, setJobs] = useState([]);
  const [myReferrals, setMyReferrals] = useState([]);
  const [form, setForm] = useState({ candidateName: '', candidateEmail: '', resumeLink: '', jobId: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
const [department, setDepartment] = useState('');

  const loadData = async () => {
  setLoading(true);
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (department) params.append('department', department);

  const jobsRes = await api.get(`/jobs?${params.toString()}`);
  setJobs(jobsRes.data);
  const referralsRes = await api.get('/referrals/my');
  setMyReferrals(referralsRes.data);
  setLoading(false);
};

  useEffect(() => {
    loadData();
  }, [search, department]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setSubmitting(true);
    try {
      await api.post('/referrals', form);
      setMessage('Referral submitted successfully!');
      setForm({ candidateName: '', candidateEmail: '', resumeLink: '', jobId: '' });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit referral');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <Navbar />
      <div className="container" style={{ paddingTop: 32, paddingBottom: 20 }}>
        <h1>Open Roles</h1>
        <p className="text-muted" style={{ marginTop: 4, marginBottom: 24 }}>Browse open positions and refer someone you trust.</p>
        <div className="filter-bar">
  <input
    className="input"
    placeholder="Search by job title..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
  <select className="input" value={department} onChange={(e) => setDepartment(e.target.value)}>
    <option value="">All Departments</option>
    {[...new Set(jobs.map((j) => j.department))].map((dept) => (
      <option key={dept} value={dept}>{dept}</option>
    ))}
  </select>
</div>

        {loading ? (
          <div className="card text-muted">Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="card text-muted">No open positions right now — check back soon.</div>
        ) : (
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', marginBottom: 32 }}>
            {jobs.map((job) => (
              <div className="card" key={job._id}>
                <div className="flex-between">
                  <h3 style={{ marginBottom: 4 }}>{job.title}</h3>
                </div>
                <p className="text-muted" style={{ marginBottom: 10 }}>{job.department}</p>
                <span className="badge badge-success">Bonus ₹{job.bonusAmount}</span>
              </div>
            ))}
          </div>
        )}

        <div className="card" style={{ maxWidth: 480, marginBottom: 32 }}>
          <h3>Refer Someone</h3>
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Job</label>
              <select className="input" name="jobId" value={form.jobId} onChange={handleChange} required>
                <option value="">Select a job</option>
                {jobs.map((job) => (
                  <option key={job._id} value={job._id}>{job.title}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Candidate name</label>
              <input className="input" name="candidateName" placeholder="Aditi Rao" value={form.candidateName} onChange={handleChange} required />
            </div>
            <div className="field">
              <label>Candidate email</label>
              <input className="input" name="candidateEmail" type="email" placeholder="aditi@example.com" value={form.candidateEmail} onChange={handleChange} required />
            </div>
            <div className="field">
              <label>Resume link (optional)</label>
              <input className="input" name="resumeLink" placeholder="https://..." value={form.resumeLink} onChange={handleChange} />
            </div>

            {error && <div className="msg-error">{error}</div>}
            {message && <div className="msg-success">{message}</div>}

            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Referral'}
            </button>
          </form>
        </div>

        <h3>My Referrals</h3>
        {myReferrals.length === 0 ? (
          <div className="card text-muted">You haven't referred anyone yet.</div>
        ) : (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {myReferrals.map((ref, i) => (
              <div
                key={ref._id}
                className="flex-between"
                style={{ padding: '14px 20px', borderTop: i === 0 ? 'none' : '1px solid var(--border)' }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{ref.candidateName}</div>
                  <div className="text-muted" style={{ fontSize: 13 }}>{ref.jobPosting?.title || 'Job removed'}</div>
                </div>
                <StatusBadge status={ref.status} />
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}