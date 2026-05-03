import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/navbar.css';

export const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
          <h1>🎯 TMS</h1>
          <span className="brand-subtitle">Team Management</span>
        </div>

        {isAuthenticated && (
          <div className="navbar-content">
            <div className="navbar-links">
              <button onClick={() => navigate('/dashboard')} className="nav-link">
                <span>📊 Dashboard</span>
              </button>
              <button onClick={() => navigate('/projects')} className="nav-link">
                <span>📁 Projects</span>
              </button>
              {isAdmin && (
                <button onClick={() => navigate('/admin')} className="nav-link admin-link">
                  <span>⚙️ Admin</span>
                </button>
              )}
            </div>
            <div className="navbar-user">
              <div className="user-info">
                <span className="user-name">{user?.name}</span>
                <span className={`user-role ${user?.role}`}>{user?.role.toUpperCase()}</span>
              </div>
              <button onClick={handleLogout} className="nav-link logout-btn">Logout</button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
