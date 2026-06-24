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
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const menuItems = [
    { icon: FaTachometerAlt, label: 'Dashboard', path: '/dashboard' },
    { icon: FaCalendarAlt, label: 'Bookings', path: '/bookings' },
    { icon: FaStar, label: 'Reviews', path: '/reviews' },
    { icon: FaGift, label: 'Add Offer', path: '/offers' },
    { icon: FaCar, label: 'Vehicles', path: '/vehicles' },
    { icon: FaUser, label: 'Profile', path: '/profile' },
  ];

  // Prefetch page on hover
  const prefetchPage = (path) => {
    // Remove leading slash and capitalize first letter
    const pageName = path.replace('/', '');
    const capitalizedPage = pageName.charAt(0).toUpperCase() + pageName.slice(1);
    
    // Dynamically import the page component
    try {
      import(`../pages/${capitalizedPage}`);
    } catch (e) {
      // Handle error silently
    }
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <button className="sidebar-toggle" onClick={toggleSidebar} aria-label="Toggle sidebar">
            {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
          </button>
          <img 
            src="/pixiyatra.png" 
            alt="PixiYatra Logo" 
            className="sidebar-logo-image"
          />
          {isOpen && <span className="sidebar-logo-text">Pixiyatra</span>}
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
                  onMouseEnter={() => prefetchPage(item.path)}
                  onClick={() => {
                    if (window.innerWidth <= 768) {
                      toggleSidebar();
                    }
                  }}
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
          <NavLink to="/login" className="sidebar-link logout">
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