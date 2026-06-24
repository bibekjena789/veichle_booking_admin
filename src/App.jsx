import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="app-container">
      <Navbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      <div className="main-layout">
        <Sidebar isOpen={sidebarOpen} />
        <main className={`content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          <div className="dashboard-content">
            {/* Welcome Section */}
            <div className="welcome-section">
              <h1>Adventure is worthwhile in every destination</h1>
              <p className="welcome-subtitle">Explore the world with Travoa</p>
            </div>

            {/* Booking Search Card */}
            <div className="booking-search-card">
              <div className="search-grid">
                <div className="search-field">
                  <label>FROM</label>
                  <input type="text" placeholder="New York (NYC)" defaultValue="New York (NYC)" />
                </div>
                <div className="search-field">
                  <label>TO</label>
                  <input type="text" placeholder="Paris (CDG)" defaultValue="Paris (CDG)" />
                </div>
                <div className="search-field">
                  <label>DEPARTURE</label>
                  <input type="date" placeholder="dd-mm-yyyy" />
                </div>
                <div className="search-field">
                  <label>RETURN</label>
                  <input type="date" placeholder="dd-mm-yyyy" />
                </div>
                <div className="search-field">
                  <label>TRAVELERS</label>
                  <input type="text" placeholder="2 Travelers" defaultValue="2 Travelers" />
                </div>
                <div className="search-field search-button">
                  <button className="btn-search">Search Flights</button>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">✈️</div>
                <div className="stat-info">
                  <h3>TOTAL BOOKINGS</h3>
                  <p className="stat-number">1,234</p>
                  <span className="stat-change positive">↑ 12%</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🏨</div>
                <div className="stat-info">
                  <h3>ACTIVE HOTELS</h3>
                  <p className="stat-number">56</p>
                  <span className="stat-change positive">↑ 15%</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">👤</div>
                <div className="stat-info">
                  <h3>TOTAL USERS</h3>
                  <p className="stat-number">892</p>
                  <span className="stat-change positive">↑ 18%</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <h3>REVENUE</h3>
                  <p className="stat-number">$45,678</p>
                  <span className="stat-change positive">↑ 15%</span>
                </div>
              </div>
            </div>

            {/* Upcoming Trips & Popular Destinations */}
            <div className="two-column-grid">
              {/* Upcoming Trips */}
              <div className="card-section">
                <div className="section-header">
                  <h2>Upcoming Trips</h2>
                  <a href="#" className="view-all">View All</a>
                </div>
                <div className="trip-list">
                  <div className="trip-item">
                    <div className="trip-icon">✈️</div>
                    <div className="trip-details">
                      <h4>Paris, France</h4>
                      <p className="trip-type">Flight</p>
                      <p className="trip-date">20 May - 27 May, 2024</p>
                      <p className="trip-travelers">👤 2 Travelers</p>
                    </div>
                  </div>
                  <div className="trip-item">
                    <div className="trip-icon">🏖️</div>
                    <div className="trip-details">
                      <h4>Bali, Indonesia</h4>
                      <p className="trip-type">Package</p>
                      <p className="trip-date">10 Jun - 15 Jun, 2024</p>
                      <p className="trip-travelers">👤 2 Travelers</p>
                    </div>
                  </div>
                  <div className="trip-item">
                    <div className="trip-icon">🏨</div>
                    <div className="trip-details">
                      <h4>Dubai, UAE</h4>
                      <p className="trip-type">Hotel</p>
                      <p className="trip-date">05 Aug - 08 Aug, 2024</p>
                      <p className="trip-travelers">👤 1 Traveler</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Popular Destinations */}
              <div className="card-section">
                <div className="section-header">
                  <h2>Popular Destinations</h2>
                  <a href="#" className="view-all">View All</a>
                </div>
                <div className="destination-list">
                  <div className="destination-item">
                    <div className="destination-image">🇬🇷</div>
                    <div className="destination-info">
                      <h4>Santorini, Greece</h4>
                      <p>2,345 bookings</p>
                    </div>
                  </div>
                  <div className="destination-item">
                    <div className="destination-image">🇯🇵</div>
                    <div className="destination-info">
                      <h4>Tokyo, Japan</h4>
                      <p>1,890 bookings</p>
                    </div>
                  </div>
                  <div className="destination-item">
                    <div className="destination-image">🇺🇸</div>
                    <div className="destination-info">
                      <h4>New York, USA</h4>
                      <p>1,567 bookings</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;