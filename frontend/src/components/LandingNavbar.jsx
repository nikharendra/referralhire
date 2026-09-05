import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

export default function LandingNavbar() {
  return (
    <header className="landing-navbar">
      <div className="container flex-between" style={{ height: 68 }}>
        <div className="landing-brand">
          <Logo size={40} fontSize={16} />
          <span className="landing-brand-text">Referral<span>Hire</span></span>
        </div>

        <nav className="landing-nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
        </nav>
      </div>
    </header>
  );
}