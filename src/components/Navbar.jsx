import React from 'react';
import './Navbar.css';

const Navbar = ({ toggleSidebar, sidebarOpen }) => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button 
          className="menu-toggle" 
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <span className="hamburger-icon">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
        <div className="logo">
          <span className="logo-icon">🚗</span>
          <span className="logo-text">Veiche Booking</span>
        </div>
      </div>

      

      <div className="navbar-right">
        <button className="notification-btn">
          <span className="notification-icon">🔔</span>
          <span className="notification-badge">3</span>
        </button>
        <div className="user-profile">
          <img 
            src="https://via.placeholder.com/40" 
            alt="User" 
            className="user-avatar"
          />
          <span className="user-name">Admin</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;