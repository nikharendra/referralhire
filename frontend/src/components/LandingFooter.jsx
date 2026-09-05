import Logo from '../components/Logo';

export default function LandingFooter() {
  return (
    <footer className="landing-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Logo size={34} fontSize={14} />
            <span className="landing-brand-text" style={{ color: '#fff', fontSize: 17 }}>
              Referral<span style={{ color: '#a5b4fc' }}>Hire</span>
            </span>
          </div>
          <p className="footer-tagline">Employee referral management, built for small businesses.</p>

          <div className="footer-links">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="/register">Register</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} ReferralHire. Built by Harendra Singh Yadav.</span>
        </div>
      </div>
    </footer>
  );
}