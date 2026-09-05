import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Settings() {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const loadCompany = async () => {
    setLoading(true);
    const res = await api.get('/company/me');
    setCompany(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadCompany();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(company.joinCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = async () => {
    if (!window.confirm('This will invalidate the current join code. Anyone with the old code will no longer be able to join. Continue?')) {
      return;
    }
    setRegenerating(true);
    setMessage('');
    try {
      const res = await api.patch('/company/regenerate-code');
      setCompany({ ...company, joinCode: res.data.joinCode });
      setMessage('New join code generated successfully.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to regenerate code');
    } finally {
      setRegenerating(false);
    }
  };

  return (
    <div className="page">
      <Navbar />
      <div className="container" style={{ paddingTop: 32, paddingBottom: 20 }}>
        <h1>Company Settings</h1>
        <p className="text-muted" style={{ marginTop: 4, marginBottom: 24 }}>Manage your company's join code and details.</p>

        {loading ? (
          <div className="card text-muted">Loading...</div>
        ) : (
          <div className="card" style={{ maxWidth: 520 }}>
            <h3>Company</h3>
            <p style={{ fontWeight: 700, fontSize: 18, marginBottom: 20 }}>{company.name}</p>

            <h3>Join Code</h3>
            <p className="text-muted" style={{ fontSize: 13, marginBottom: 14 }}>
              Share this code with HR or employees so they can join your company on signup.
            </p>

            <div className="join-code-box" style={{ marginBottom: 16, cursor: 'pointer' }} onClick={handleCopy}>
              {company.joinCode}
              <span className="copy-hint">{copied ? '✓ Copied' : 'Click to copy'}</span>
            </div>

            {message && <div className="msg-success">{message}</div>}

            <button className="btn btn-secondary" onClick={handleRegenerate} disabled={regenerating}>
              {regenerating ? 'Regenerating...' : 'Regenerate Join Code'}
            </button>
            <p className="text-muted" style={{ fontSize: 12, marginTop: 10 }}>
              Regenerating will invalidate the current code immediately — anyone who hasn't joined yet will need the new one.
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}