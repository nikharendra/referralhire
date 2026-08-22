import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="container flex-between" style={{ height: 64 }}>
        <div className="brand">
          <div className="brand-logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="8" cy="7" r="3" fill="#fff" />
              <circle cx="16" cy="7" r="3" fill="rgba(255,255,255,0.7)" />
              <path d="M2 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#fff" strokeWidth="1.8" fill="none" />
              <path d="M12 20c0-3.3 2.7-6 6-6" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" fill="none" />
            </svg>
          </div>
          <span className="brand-text">Referral<span>Hire</span></span>
        </div>

        {user && (
          <div className="flex gap-sm" style={{ alignItems: 'center' }}>
            <span className="role-pill">{user.role === 'hr' ? 'HR Admin' : 'Employee'}</span>
            <span className="text-muted" style={{ color: '#e0e7ff', fontSize: 14 }}>{user.name}</span>
            <button className="btn btn-secondary btn-sm" onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </header>
  );
}