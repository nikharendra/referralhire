import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import PasswordInput from '../components/PasswordInput';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data);
      navigate(res.data.role === 'hr' ? '/hr' : '/employee');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
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
        <h2 style={{ textAlign: 'center' }}>Welcome back</h2>
        <p className="text-muted" style={{ textAlign: 'center', marginBottom: 24 }}>Login to your ReferralHire account</p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Email</label>
            <input
              className="input"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Password</label>
            <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {error && <div className="msg-error">{error}</div>}

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-muted" style={{ textAlign: 'center', marginTop: 18 }}>
          Don't have an account? <Link to="/signup" className="auth-link">Sign up</Link>
        </p>
      </div>
    </div>
  );
}