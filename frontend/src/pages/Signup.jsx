import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import PasswordInput from '../components/PasswordInput';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'employee', company: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
      login(res.data);
      navigate(res.data.role === 'hr' ? '/hr' : '/employee');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-logo">
          <div className="brand-logo brand-logo-dark">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="8" cy="7" r="3" fill="#fff" />
              <circle cx="16" cy="7" r="3" fill="#c7d2fe" />
              <path d="M2 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#fff" strokeWidth="1.8" fill="none" />
              <path d="M12 20c0-3.3 2.7-6 6-6" stroke="#c7d2fe" strokeWidth="1.8" fill="none" />
            </svg>
          </div>
        </div>
        <h2 style={{ textAlign: 'center' }}>Create your account</h2>
        <p className="text-muted" style={{ textAlign: 'center', marginBottom: 24 }}>Join ReferralHire in a few seconds</p>

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
            <label>Company</label>
            <input className="input" name="company" placeholder="Company name" value={form.company} onChange={handleChange} />
          </div>
          <div className="field">
            <label>I am a</label>
            <select className="input" name="role" value={form.role} onChange={handleChange}>
              <option value="employee">Employee</option>
              <option value="hr">HR Admin</option>
            </select>
          </div>

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
  );
}