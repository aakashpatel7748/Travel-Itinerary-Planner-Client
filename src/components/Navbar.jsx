import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlane, FaPlus, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass-navbar navbar animate-fade-in w-100 py-3" style={styles.nav}>
      <div className="container-xl d-flex justify-content-between align-items-center">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2 m-0" style={styles.logo}>
          <FaPlane style={styles.logoIcon} />
          <span className="logo-text">Orbitra Travel AI</span>
        </Link>

        {user ? (
          <div className="d-flex align-items-center gap-3">
            {/* Quick Actions for Logged In User */}
            <Link to="/create-itinerary" className="btn btn-primary btn-sm d-none d-md-flex align-items-center gap-2 px-3 py-2" style={styles.actionBtn}>
              <FaPlus size={12} /> Create Itinerary
            </Link>

            {/* Profile Badge */}
            <div className="d-flex align-items-center gap-2 px-3 py-1.5 rounded-pill" style={styles.profileBadge}>
              <span style={styles.avatar}>
                {user.name.charAt(0).toUpperCase()}
              </span>
              <span className="d-none d-sm-inline" style={styles.userName}>
                {user.name}
              </span>
            </div>

            {/* Logout Action */}
            <button onClick={handleLogout} className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2 px-3 py-2" style={styles.logoutBtn}>
              <FaSignOutAlt size={14} /> <span className="d-none d-sm-inline">Logout</span>
            </button>
          </div>
        ) : (
          <div className="d-flex align-items-center gap-2">
            <Link to="/login" className="btn btn-outline-light btn-sm px-3 py-2" style={styles.loginBtn}>
              Login
            </Link>
            <Link to="/signup" className="btn btn-primary btn-sm px-3 py-2" style={styles.actionBtn}>
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    height: '72px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(11, 15, 25, 0.8)',
    backdropFilter: 'blur(12px)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    width: '100%'
  },
  logo: {
    fontSize: '1.35rem',
    fontWeight: '800',
    color: '#ffffff',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    letterSpacing: '-0.02em'
  },
  logoIcon: {
    fontSize: '1.5rem',
    color: '#3b82f6',
    transform: 'rotate(-45deg)',
  },
  actionBtn: {
    fontSize: '0.85rem',
    fontWeight: '600',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    border: 'none',
    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
    color: '#ffffff',
    transition: 'all 0.2s ease',
  },
  profileBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    fontSize: '0.85rem',
    height: '38px',
  },
  avatar: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: '#8b5cf6',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '0.75rem',
  },
  userName: {
    fontSize: '0.85rem',
    fontWeight: '550',
    color: '#e2e8f0'
  },
  logoutBtn: {
    borderRadius: '10px',
    fontSize: '0.85rem',
    fontWeight: '550',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#f87171',
    backgroundColor: 'transparent',
    transition: 'all 0.2s ease',
  },
  loginBtn: {
    borderRadius: '10px',
    fontSize: '0.85rem',
    fontWeight: '600',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: '#f8fafc',
    transition: 'all 0.2s ease',
  }
};

export default Navbar;
