import { Link } from 'react-router-dom';
import LandingNavbar from '../components/LandingNavbar';
import LandingFooter from '../components/LandingFooter';

export default function Landing() {
  return (
    <div className="landing-page">
      <LandingNavbar />

      {/* HOME */}
      <section id="home" className="hero">
        <div className="container">
          <div className="hero-content">
            <span className="hero-eyebrow">EMPLOYEE REFERRAL SAAS</span>
            <h1>Turn your employees into your strongest hiring engine</h1>
            <p className="hero-sub">
              Post roles, let your team refer people they trust, track every referral through hiring,
              and automate the bonus payout — all in one place built for small businesses.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary" style={{ padding: '13px 28px', fontSize: 15 }}>
                Get Started Free
              </Link>
              <a href="#about" className="btn btn-secondary" style={{ padding: '13px 28px', fontSize: 15 }}>
                See how it works
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE CARDS */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Everything you need to run referrals</h2>
          <p className="section-sub">No spreadsheets. No missed payouts. Just a clear pipeline from referral to reward.</p>

          <div className="feature-grid">
            <FeatureCard icon="💼" title="Job Postings" desc="Post open roles with a referral bonus attached, so employees know exactly what's in it for them." />
            <FeatureCard icon="🔗" title="Referral Tracking" desc="Every referral moves through a clear pipeline — submitted, review, interview, hired." />
            <FeatureCard icon="💰" title="Automated Payouts" desc="Bonuses are validated and tracked automatically once a candidate is marked hired." />
            <FeatureCard icon="📊" title="Live Dashboards" desc="HR sees real-time stats on open roles, referrals, hires, and pending payouts." />
            <FeatureCard icon="🔒" title="Role-Based Access" desc="HR and employees see exactly what they should — enforced at the API level, not just hidden in the UI." />
            <FeatureCard icon="🏢" title="Multi-Company Ready" desc="Each company's data is fully isolated — built for multiple organizations from day one." />
          </div>
        </div>
      </section>
            {/* ABOUT */}
      <section id="about" className="about">
        <div className="container">
          <h2 className="section-title">How it works</h2>
          <p className="section-sub">From job posting to payout, in three simple steps.</p>

          <div className="steps-grid">
            <StepCard number="1" title="HR posts a role" desc="HR creates a job opening and attaches a referral bonus employees can see up front." />
            <StepCard number="2" title="Employees refer someone" desc="Team members browse open roles and refer candidates they personally trust." />
            <StepCard number="3" title="Track, hire, and reward" desc="HR tracks each referral through the pipeline, and once hired, the bonus payout is tracked automatically." />
          </div>

          <div className="about-note">
            <h3>Why ReferralHire exists</h3>
            <p>
              Referred candidates make better hires — they join faster, stay longer, and fit the team better
              than portal hires. But most small businesses track referrals over email or spreadsheets, which
              means HR loses track of who referred whom and bonuses get delayed. ReferralHire fixes that with
              one simple, transparent system — built specifically for small teams that enterprise HR tools
              price out.
            </p>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}


function FeatureCard({ icon, title, desc }) {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}

function StepCard({ number, title, desc }) {
  return (
    <div className="step-card">
      <div className="step-number">{number}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}