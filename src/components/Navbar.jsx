import React from 'react';
import './Navbar.css';
import { FaBars, FaBell, FaSearch, FaUserCircle } from 'react-icons/fa';

const Navbar = ({ toggleSidebar, sidebarOpen }) => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button 
          className="menu-toggle" 
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <FaBars size={20} />
        </button>
        <div className="logo">
          <span className="logo-icon">🚗</span>
          <span className="logo-text">Veiche Booking</span>
        </div>
      </div>

      

      <div className="navbar-right">
        <button className="notification-btn">
          <FaBell size={20} />
          <span className="notification-badge">3</span>
        </button>
        <div className="user-profile">
          <FaUserCircle size={35} className="user-avatar" />
          <span className="user-name">Admin</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;