import React from 'react';
import './Sidebar.css';
import { 
  FaTachometerAlt, 
  FaGift, 
  FaCar, 
  FaCalendarAlt, 
  FaStar, 
  FaUser, 
  FaSignOutAlt 
} from 'react-icons/fa';

const Sidebar = ({ isOpen }) => {
  const menuItems = [
    { icon: FaTachometerAlt, label: 'Dashboard', active: true },
    { icon: FaGift, label: 'Offers' },
    { icon: FaCar, label: 'Vehicles' },
    { icon: FaCalendarAlt, label: 'Bookings' },
    { icon: FaStar, label: 'Reviews' },
    { icon: FaUser, label: 'Profile' },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="sidebar-logo-icon">🌍</span>
          {isOpen && <span className="sidebar-logo-text">Travoa</span>}
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <li key={index} className={`sidebar-item ${item.active ? 'active' : ''}`}>
                <a href="#" className="sidebar-link">
                  <span className="sidebar-icon">
                    <Icon />
                  </span>
                  {isOpen && <span className="sidebar-label">{item.label}</span>}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-item">
          <a href="#" className="sidebar-link logout">
            <span className="sidebar-icon">
              <FaSignOutAlt />
            </span>
            {isOpen && <span className="sidebar-label">Logout</span>}
          </a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;