import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [devLink, setDevLink] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setMessage(res.data.message);
      if (res.data.resetLink) setDevLink(res.data.resetLink);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <h2 style={{ textAlign: 'center' }}>Forgot password?</h2>
        <p className="text-muted" style={{ textAlign: 'center', marginBottom: 24 }}>
          Enter your email and we'll generate a reset link.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Email</label>
            <input className="input" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          {error && <div className="msg-error">{error}</div>}
          {message && <div className="msg-success">{message}</div>}

          {devLink && (
            <div className="dev-link-box">
              <span className="dev-link-label">DEV MODE — reset link:</span>
              <a href={devLink}>{devLink}</a>
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-block" disabled={loading} style={{ marginTop: 12 }}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="text-muted" style={{ textAlign: 'center', marginTop: 18 }}>
          <Link to="/login" className="auth-link">Back to login</Link>
        </p>
      </div>
    </div>
  );
}