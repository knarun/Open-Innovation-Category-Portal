import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  const location = useLocation(); // Get the current location

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    window.location.href = '/login'; // Redirect to login page
  };

  return (
    <div className="sidebar">
      <div className={`sidebar-item ${location.pathname === '/' ? 'active' : ''}`}>
        <Link to="/">Main</Link>
      </div>
      <div className={`sidebar-item ${location.pathname === '/profile' ? 'active' : ''}`}>
        <Link to="/profile"><div className="sidebar-item">Profile</div></Link>
      </div>
      <div className={`sidebar-item ${location.pathname === '/register' ? 'active' : ''}`}>
        <Link to="/register"><div className="sidebar-item">Register</div></Link>
      </div>
      <div className={`sidebar-item ${location.pathname === '/yourproject' ? 'active' : ''}`}>
        <Link to="/yourproject"> <div className="sidebar-item">Your Project</div></Link>
      </div>
      <div className="sidebar-item" onClick={handleLogout}>
      <div className="sidebar-item">Logout</div>
      </div>
    </div>
  );
}

export default Sidebar;
