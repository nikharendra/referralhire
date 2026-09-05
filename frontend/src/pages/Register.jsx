import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

export default function Register() {
  return (
    <div className="auth-page">
      <div className="auth-card card" style={{ maxWidth: 440, textAlign: 'center' }}>
        <div className="auth-logo"><Logo size={52} fontSize={20} dark /></div>
        <h2>Get started with ReferralHire</h2>
        <p className="text-muted" style={{ marginBottom: 28 }}>Choose an option to continue</p>

        <Link to="/signup" className="choice-card">
          <div className="choice-icon">🚀</div>
          <div>
            <div className="choice-title">I'm new here</div>
            <div className="choice-desc">Create an account for yourself or your company</div>
          </div>
        </Link>

        <Link to="/login" className="choice-card">
          <div className="choice-icon">👋</div>
          <div>
            <div className="choice-title">I already have an account</div>
            <div className="choice-desc">Log in to your existing dashboard</div>
          </div>
        </Link>

        <p className="text-muted" style={{ marginTop: 20 }}>
          <Link to="/" className="auth-link">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}