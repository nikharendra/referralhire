export default function Footer() {
  return (
    <footer className="footer">
      <div className="container flex-between" style={{ height: 56, flexWrap: 'wrap' }}>
        <div className="flex gap-sm" style={{ alignItems: 'center' }}>
          <div className="brand-logo" style={{ width: 22, height: 22 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <circle cx="8" cy="7" r="3" fill="#fff" />
              <circle cx="16" cy="7" r="3" fill="rgba(255,255,255,0.7)" />
              <path d="M2 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#fff" strokeWidth="1.8" fill="none" />
              <path d="M12 20c0-3.3 2.7-6 6-6" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" fill="none" />
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: 13 }}>ReferralHire</span>
        </div>
        <span className="text-muted" style={{ fontSize: 12.5 }}>Built for Simply Updify InnovateX 2.0</span>
      </div>
    </footer>
  );
}