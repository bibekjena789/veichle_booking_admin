import React from 'react';
import '../css/Dashboard.css';

function Dashboard() {
  return (
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
            <label>From</label>
            <input type="text" placeholder="New York (NYC)" defaultValue="New York (NYC)" />
          </div>
          <div className="search-field">
            <label>To</label>
            <input type="text" placeholder="Paris (CDG)" defaultValue="Paris (CDG)" />
          </div>
          <div className="search-field">
            <label>Departure</label>
            <input type="date" defaultValue="2024-05-20" />
          </div>
          <div className="search-field">
            <label>Return</label>
            <input type="date" defaultValue="2024-05-27" />
          </div>
          <div className="search-field">
            <label>Travelers</label>
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

      {/* Two Column Grid */}
      <div className="two-column-grid">
        {/* Left Column */}
        <div className="left-column">
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
                  <p className="trip-date">20 May – 27 May, 2024</p>
                  <p className="trip-travelers">👤 2 Travelers</p>
                </div>
              </div>
              <div className="trip-item">
                <div className="trip-icon">🏖️</div>
                <div className="trip-details">
                  <h4>Bali, Indonesia</h4>
                  <p className="trip-type">Package</p>
                  <p className="trip-date">10 Jun – 15 Jun, 2024</p>
                  <p className="trip-travelers">👤 2 Travelers</p>
                </div>
              </div>
              <div className="trip-item">
                <div className="trip-icon">🏨</div>
                <div className="trip-details">
                  <h4>Dubai, UAE</h4>
                  <p className="trip-type">Hotel</p>
                  <p className="trip-date">05 Aug – 08 Aug, 2024</p>
                  <p className="trip-travelers">👤 1 Traveler</p>
                </div>
              </div>
            </div>
          </div>

          {/* Top Offers */}
          <div className="card-section">
            <div className="section-header">
              <h2>Top Offers for You</h2>
              <a href="#" className="view-all">View All</a>
            </div>
            <div className="offers-list">
              <div className="offer-item">
                <div className="offer-info">
                  <p className="offer-id">Booking ID: TRV123456</p>
                  <span className="badge confirmed">Confirmed</span>
                </div>
              </div>
              <div className="offer-item">
                <div className="offer-info">
                  <p className="offer-id">Booking ID: TRV789012</p>
                  <span className="badge confirmed">Confirmed</span>
                </div>
              </div>
              <div className="offer-item">
                <div className="offer-info">
                  <p className="offer-id">Booking ID: TRV345678</p>
                  <span className="badge pending">Pending</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
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

          {/* Reward Points */}
          <div className="card-section reward-card">
            <div className="reward-content">
              <div className="reward-icon">⭐</div>
              <div className="reward-info">
                <h3>Reward Points</h3>
                <p className="reward-points">1,250</p>
                <button className="reward-btn">Redeem now</button>
              </div>
            </div>
          </div>

          {/* Plan Your Dream Vacation */}
          <div className="card-section vacation-card">
            <div className="vacation-content">
              <h3>Plan your dream vacation</h3>
              <p>Get up to 30% off on selected packages</p>
              <button className="vacation-btn">Explore Deals</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;