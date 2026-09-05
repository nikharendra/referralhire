import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import PasswordInput from '../components/PasswordInput';
import Logo from '../components/Logo';

export default function Signup() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'employee',
    companyAction: 'create', companyName: '', joinCode: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [createdCompany, setCreatedCompany] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/signup', form);
      if (form.role === 'hr' && form.companyAction === 'create') {
        setCreatedCompany(res.data.company);
        login(res.data);
      } else {
        login(res.data);
        navigate(res.data.role === 'hr' ? '/hr' : '/employee');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  if (createdCompany) {
    return (
      <div className="split-auth">
        <div className="split-brand">
        <Logo size={44} fontSize={17} />
          <h1>You're all set up</h1>
          <p className="tagline">Share your join code with your team so they can sign up under your company.</p>
        </div>
        <div className="split-form-side">
          <div className="split-form-inner" style={{ textAlign: 'center' }}>
            <h2>Company created! 🎉</h2>
            <p className="text-muted" style={{ marginBottom: 20 }}>
              Share this join code with your team so they can sign up under <b>{createdCompany.name}</b>.
            </p>
            <div className="join-code-box">{createdCompany.joinCode}</div>
            <button className="btn btn-primary btn-block" style={{ marginTop: 24 }} onClick={() => navigate('/hr')}>
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="split-auth">
      <div className="split-brand">
        <Logo size={44} fontSize={17} />
        <h1>Employee Referral Management, Simplified</h1>
        <p className="tagline">Post roles, track referrals, and automate payouts — all in one place built for small teams.</p>
        <div className="split-welcome">
          <div className="split-welcome-title">🚀 Get started</div>
          <p>Create your company workspace, or join your team using an invite code.</p>
        </div>
      </div>

      <div className="split-form-side">
        <div className="split-form-inner">
          <div className="auth-toggle">
            <Link to="/login">Sign In</Link>
            <Link to="/signup" className="active">Sign Up</Link>
          </div>

          <h2>Create your account</h2>
          <p className="text-muted" style={{ marginBottom: 24 }}>Join ReferralHire in a few seconds</p>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Full name</label>
              <input className="input" name="name" placeholder="Harendra Singh Yadav" value={form.name} onChange={handleChange} required />
            </div>
            <div className="field">
              <label>Email</label>
              <input className="input" name="email" type="email" placeholder="you@company.com" value={form.email} onChange={handleChange} required />
            </div>
            <div className="field">
              <label>Password</label>
              <PasswordInput value={form.password} onChange={handleChange} />
            </div>
            <div className="field">
              <label>I am a</label>
              <select className="input" name="role" value={form.role} onChange={handleChange}>
                <option value="employee">Employee</option>
                <option value="hr">HR Admin</option>
              </select>
            </div>

            {form.role === 'hr' && (
              <div className="field">
                <label>Company</label>
                <select className="input" name="companyAction" value={form.companyAction} onChange={handleChange}>
                  <option value="create">Create a new company</option>
                  <option value="join">Join an existing company</option>
                </select>
              </div>
            )}

            {form.role === 'hr' && form.companyAction === 'create' && (
              <div className="field">
                <label>Company name</label>
                <input className="input" name="companyName" placeholder="Acme Corp" value={form.companyName} onChange={handleChange} required />
              </div>
            )}

            {(form.role === 'employee' || (form.role === 'hr' && form.companyAction === 'join')) && (
              <div className="field">
                <label>Company join code</label>
                <input className="input" name="joinCode" placeholder="e.g. K3F9XQ2P" value={form.joinCode} onChange={handleChange} required style={{ textTransform: 'uppercase' }} />
              </div>
            )}

            {error && <div className="msg-error">{error}</div>}

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-muted" style={{ textAlign: 'center', marginTop: 18 }}>
            Already have an account? <Link to="/login" className="auth-link">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}