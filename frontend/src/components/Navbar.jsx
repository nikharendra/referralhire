import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Logo from './Logo';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState('');

  useEffect(() => {
    if (user) {
      api.get('/company/me').then((res) => setCompanyName(res.data.name)).catch(() => {});
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="container flex-between" style={{ minHeight: 64, flexWrap: 'wrap', rowGap: 8 }}>
        <div className="brand">
          <Logo size={32} fontSize={13} />
          <div>
            <div className="brand-text">Referral<span>Hire</span></div>
            {companyName && <div className="company-name-tag">{companyName}</div>}
          </div>
        </div>

        {user && (
          <div className="flex gap-sm" style={{ alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <NotificationBell />
            <span className="role-pill">{user.role === 'hr' ? 'HR Admin' : 'Employee'}</span>
            <span className="text-muted" style={{ color: '#e0e7ff', fontSize: 14 }}>{user.name}</span>
            {user.role === 'hr' && (
              <Link to="/settings" className="btn btn-secondary btn-sm">Settings</Link>
            )}
            <button className="btn btn-secondary btn-sm" onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </header>
  );
}