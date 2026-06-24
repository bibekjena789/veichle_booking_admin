import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import { 
  FaTachometerAlt, 
  FaGift, 
  FaCar, 
  FaCalendarAlt, 
  FaStar, 
  FaUser,
  FaPlane,
  FaHotel,
  FaSuitcase,
  FaBookmark,
  FaWallet,
  FaHeadset,
  FaCog,
  FaSignOutAlt
} from 'react-icons/fa';

const Sidebar = ({ isOpen }) => {
  const menuItems = [
    { icon: FaTachometerAlt, label: 'Dashboard', path: '/dashboard' },
    { icon: FaCalendarAlt, label: 'Bookings', path: '/bookings' },
    { icon: FaStar, label: 'Reviews', path: '/reviews' },
    { icon: FaStar, label: 'Add Offer', path: '/offers' },
    { icon: FaCog, label: 'Vehicles', path: '/vehicles' },
    { icon: FaUser, label: 'Profile', path: '/profile' },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="sidebar-logo-icon">✈️</span>
          {isOpen && <span className="sidebar-logo-text">Travoa</span>}
        </div>
        {isOpen && <p className="sidebar-tagline">Explore the world</p>}
      </div>

      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <li key={index} className="sidebar-item">
                <NavLink 
                  to={item.path} 
                  className={({ isActive }) => 
                    `sidebar-link ${isActive ? 'active' : ''}`
                  }
                >
                  <span className="sidebar-icon">
                    <Icon />
                  </span>
                  {isOpen && <span className="sidebar-label">{item.label}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-item">
          <NavLink to="/logout" className="sidebar-link logout">
            <span className="sidebar-icon">
              <FaSignOutAlt />
            </span>
            {isOpen && <span className="sidebar-label">Logout</span>}
          </NavLink>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;