import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import './Layout.css';

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="app-container">
      {/* Left Sidebar - Full height top to bottom */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Right Content Area */}
      <div className={`right-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {/* Navbar at top of right content */}
        <Navbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        
        {/* Main Content */}
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;