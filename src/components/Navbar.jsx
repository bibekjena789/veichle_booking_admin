import React from "react";
import "./Navbar.css";
import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth"; // adjust path

const Navbar = ({ toggleSidebar }) => {
  const { getUserName } = useAuth();

  const userName = getUserName();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button
          className="menu-toggle"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <span className="hamburger-icon">☰</span>
        </button>

        <Link to="/" className="logo">
          <span className="logo-icon">🚗</span>
          <span className="logo-text">Vehicles Booking</span>
          <span className="logo-divider">|</span>
          <span className="logo-sub">pixiyatra</span>
        </Link>
      </div>

      <div className="navbar-center">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search destinations, hotels, flights..."
          />
        </div>
      </div>

      <div className="navbar-right">
        <button className="notification-btn">
          <FaBell size={20} />
          <span className="notification-badge">3</span>
        </button>

        <div className="user-profile">
          <FaUserCircle size={35} className="user-avatar" />
          <span className="user-name">{userName}</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;