import React from "react";
import {
  FaPlane,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUsers,
  FaSearch,
  FaGift,
} from "react-icons/fa";

import "../css/Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard">

      {/* HERO SECTION */}
      <div className="hero-section">
        <div className="hero-overlay">
          <h1>
            Adventure is worthwhile
            <br />
            in every <span>destination</span>
          </h1>

          {/* SEARCH BOX */}
          <div className="search-box">

            <div className="search-item">
              <FaPlane />
              <div>
                <label>From</label>
                <p>New York (NYC)</p>
              </div>
            </div>

            <div className="search-item">
              <FaMapMarkerAlt />
              <div>
                <label>To</label>
                <p>Paris (CDG)</p>
              </div>
            </div>

            <div className="search-item">
              <FaCalendarAlt />
              <div>
                <label>Departure</label>
                <p>20 May, 2024</p>
              </div>
            </div>

            <div className="search-item">
              <FaCalendarAlt />
              <div>
                <label>Return</label>
                <p>27 May, 2024</p>
              </div>
            </div>

            <div className="search-item">
              <FaUsers />
              <div>
                <label>Travelers</label>
                <p>2 Travelers</p>
              </div>
            </div>

            <button className="search-btn">
              <FaSearch />
            </button>

          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-grid">

        <div className="stat-card">
          <h5>Total Bookings</h5>
          <h2>12</h2>
          <span>+3 this month</span>
        </div>

        <div className="stat-card">
          <h5>Upcoming Trips</h5>
          <h2>3</h2>
          <span>View all →</span>
        </div>

        <div className="stat-card">
          <h5>Wallet Balance</h5>
          <h2>$620.50</h2>
          <span>Top up now →</span>
        </div>

        <div className="stat-card">
          <h5>Reward Points</h5>
          <h2>1,250</h2>
          <span>Redeem now →</span>
        </div>

      </div>

      {/* CONTENT */}
      <div className="dashboard-grid">

        {/* LEFT */}
        <div className="left-side">

          <div className="section-card">
            <div className="section-header">
              <h3>Upcoming Trips</h3>
              <a href="/">View All</a>
            </div>

            <div className="trip-card">
              <img
                src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34"
                alt=""
              />
              <div>
                <h4>Paris, France</h4>
                <p>20 May - 27 May • 2 Travelers</p>
              </div>
              <span className="status confirmed">
                Confirmed
              </span>
            </div>

            <div className="trip-card">
              <img
                src="https://images.unsplash.com/photo-1537996194471-e657df975ab4"
                alt=""
              />
              <div>
                <h4>Bali, Indonesia</h4>
                <p>10 Jun - 15 Jun • 2 Travelers</p>
              </div>
              <span className="status confirmed">
                Confirmed
              </span>
            </div>

            <div className="trip-card">
              <img
                src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c"
                alt=""
              />
              <div>
                <h4>Dubai, UAE</h4>
                <p>05 Aug - 08 Aug • 1 Traveler</p>
              </div>
              <span className="status pending">
                Pending
              </span>
            </div>

          </div>

        </div>

        {/* RIGHT */}
        <div className="right-side">

          <div className="section-card">
            <div className="section-header">
              <h3>Popular Destinations</h3>
              <a href="/">View All</a>
            </div>

            <div className="destinations">

              <div className="destination">
                <img
                  src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff"
                  alt=""
                />
                <span>Santorini</span>
              </div>

              <div className="destination">
                <img
                  src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf"
                  alt=""
                />
                <span>Tokyo</span>
              </div>

              <div className="destination">
                <img
                  src="https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2"
                  alt=""
                />
                <span>New York</span>
              </div>

            </div>
          </div>

          <div className="section-card offer-card">
            <h3>Top Offers For You</h3>

            <img
              src="https://images.unsplash.com/photo-1573843981267-be1999ff37cd"
              alt=""
            />

            <div className="offer-details">
              <span className="discount">30% OFF</span>
              <h4>Maldives Paradise Escape</h4>
              <h2>$899</h2>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;