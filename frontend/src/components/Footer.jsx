import Logo from '../components/Logo';
export default function Footer() {
  return (
    <footer className="footer">
      <div className="container flex-between" style={{ height: 56, flexWrap: 'wrap' }}>
        <div className="flex gap-sm" style={{ alignItems: 'center' }}>
          <div className="brand-logo" style={{ width: 22, height: 22 }}>
            <Logo size={22} fontSize={9} />
          </div>
          <span style={{ fontWeight: 700, fontSize: 13 }}>ReferralHire</span>
        </div>
        <span className="text-muted" style={{ fontSize: 12.5 }}>Built by Harendra Singh Yadav</span>
      </div>
    </footer>
  );
}