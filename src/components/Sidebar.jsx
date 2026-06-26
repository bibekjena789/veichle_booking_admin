import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
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
  FaChevronRight,
  FaMobileAlt,
  FaLaptop,
  FaChevronDown,
  FaChevronUp,
  FaSpinner
} from 'react-icons/fa';
import authService from '../api/auth';
import encryptionService from '../utils/encryption';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [showLogoutOptions, setShowLogoutOptions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logoutType, setLogoutType] = useState(null);
  const navigate = useNavigate();

  const menuItems = [
    { icon: FaTachometerAlt, label: 'Dashboard', path: '/dashboard' },
    { icon: FaCar, label: 'Vehicles', path: '/vehicles' },
    { icon: FaCalendarAlt, label: 'Bookings', path: '/bookings' },
    { icon: FaGift, label: 'Add Offer', path: '/offers' },
    { icon: FaStar, label: 'Reviews', path: '/reviews' },
    { icon: FaUser, label: 'Profile', path: '/profile' },
  ];

  // Prefetch page on hover (with error handling)
  const prefetchPage = (path) => {
    try {
      const pageName = path.replace('/', '');
      const capitalizedPage = pageName.charAt(0).toUpperCase() + pageName.slice(1);
      import(`../pages/${capitalizedPage}`).catch(() => {});
    } catch (e) {
      // Silently fail
    }
  };

  // Handle logout from current device
  const handleLogoutCurrentDevice = async () => {
    setLoading(true);
    setLogoutType('current');
    try {
      const result = await authService.logout();
      if (result.success) {
        // Clear current device session data
        encryptionService.clearSession();
        // Show success message
        console.log('Logged out from current device successfully');
        navigate('/login');
      } else {
        console.error('Logout failed:', result.message);
        // Still clear session and redirect
        encryptionService.clearSession();
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
      encryptionService.clearSession();
      navigate('/login');
    } finally {
      setLoading(false);
      setShowLogoutOptions(false);
      setLogoutType(null);
    }
  };

  // Handle logout from all devices
  const handleLogoutAllDevices = async () => {
    setLoading(true);
    setLogoutType('all');
    try {
      const result = await authService.logoutAllDevices();
      
      console.log('Logout all devices response:', result);
      
      if (result.success) {
        // Clear current device session data
        encryptionService.clearSession();
        
        // Show success message with number of blacklisted tokens
        const message = result.blacklistedTokens > 0 
          ? `Logged out from all devices successfully. ${result.blacklistedTokens} sessions were terminated.`
          : 'Logged out from all devices successfully.';
        
        console.log(message);
        
        // You can show a toast notification here if you have one
        alert(message);
        
        navigate('/login');
      } else {
        console.error('Logout all devices failed:', result.message);
        // Still clear session and redirect
        encryptionService.clearSession();
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout all devices error:', error);
      encryptionService.clearSession();
      navigate('/login');
    } finally {
      setLoading(false);
      setShowLogoutOptions(false);
      setLogoutType(null);
    }
  };

  const toggleLogoutOptions = () => {
    if (!loading) {
      setShowLogoutOptions(!showLogoutOptions);
    }
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <img 
            src="/pixiyatra.png" 
            alt="PixiYatra Logo" 
            className="sidebar-logo-image"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          {isOpen && <span className="sidebar-logo-text">Pixiyatra</span>}
          <button className="sidebar-toggle" onClick={toggleSidebar} aria-label="Toggle sidebar">
            {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
          </button>
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
        {/* Logout Dropdown */}
        <div className="sidebar-item logout-container">
          <div className="logout-wrapper">
            <button 
              className={`sidebar-link logout-btn ${showLogoutOptions ? 'active' : ''}`}
              onClick={toggleLogoutOptions}
              disabled={loading}
            >
              <span className="sidebar-icon">
                {loading ? <FaSpinner className="spinning" /> : <FaSignOutAlt />}
              </span>
              {isOpen && (
                <>
                  <span className="sidebar-label">
                    {loading ? (
                      logoutType === 'all' ? 'Logging out all devices...' : 'Logging out...'
                    ) : (
                      'Logout'
                    )}
                  </span>
                  {!loading && (
                    <span className="dropdown-arrow-icon">
                      {showLogoutOptions ? <FaChevronUp /> : <FaChevronDown />}
                    </span>
                  )}
                </>
              )}
            </button>
          </div>
          
          {/* Dropdown Options */}
          {isOpen && showLogoutOptions && !loading && (
            <div className="logout-dropdown">
              <div className="logout-dropdown-header">
                <span className="dropdown-title">Logout Options</span>
                <button 
                  className="dropdown-close"
                  onClick={() => setShowLogoutOptions(false)}
                >
                  ✕
                </button>
              </div>
              
              <button 
                className="logout-option"
                onClick={handleLogoutCurrentDevice}
              >
                <FaMobileAlt className="option-icon" />
                <div className="option-text">
                  <span className="option-title">Logout Current Device</span>
                  <span className="option-subtitle">Logout from this device only</span>
                </div>
              </button>
              
              <div className="dropdown-divider"></div>
              
              <button 
                className="logout-option logout-all"
                onClick={handleLogoutAllDevices}
              >
                <FaLaptop className="option-icon" />
                <div className="option-text">
                  <span className="option-title">Logout All Devices</span>
                  <span className="option-subtitle">Logout from all active sessions</span>
                </div>
                {/* <span className="option-badge">Recommended</span> */}
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;