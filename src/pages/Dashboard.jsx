import React from "react";
import {
  FaPlane,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUsers,
  FaSearch,
} from "react-icons/fa";

import "../css/Dashboard.css";

function Dashboard() {
  return (
    <div className="pixiyatra-dashboard-main-container">

      {/* HERO SECTION */}
      <div className="pixiyatra-dashboard-hero-banner-section">
        <div className="pixiyatra-dashboard-hero-banner-overlay">

          <h1>
            Adventure is worthwhile
            <br />
            in every <span>destination</span>
          </h1>

          {/* SEARCH BOX */}
          <div className="pixiyatra-dashboard-flight-search-container">

            <div className="pixiyatra-dashboard-flight-search-item">
              <FaPlane />
              <div>
                <label>From</label>
                <p>New York (NYC)</p>
              </div>
            </div>

            <div className="pixiyatra-dashboard-flight-search-item">
              <FaMapMarkerAlt />
              <div>
                <label>To</label>
                <p>Paris (CDG)</p>
              </div>
            </div>

            <div className="pixiyatra-dashboard-flight-search-item">
              <FaCalendarAlt />
              <div>
                <label>Departure</label>
                <p>20 May, 2024</p>
              </div>
            </div>

            <div className="pixiyatra-dashboard-flight-search-item">
              <FaCalendarAlt />
              <div>
                <label>Return</label>
                <p>27 May, 2024</p>
              </div>
            </div>

            <div className="pixiyatra-dashboard-flight-search-item">
              <FaUsers />
              <div>
                <label>Travelers</label>
                <p>2 Travelers</p>
              </div>
            </div>

            <button className="pixiyatra-dashboard-flight-search-button">
              <FaSearch />
            </button>

          </div>

        </div>
      </div>

      {/* STATS */}

      <div className="pixiyatra-dashboard-statistics-grid-container">

        <div className="pixiyatra-dashboard-single-statistics-card">
          <h5>Total Bookings</h5>
          <h2>12</h2>
          <span>+3 this month</span>
        </div>

        <div className="pixiyatra-dashboard-single-statistics-card">
          <h5>Upcoming Trips</h5>
          <h2>3</h2>
          <span>View all →</span>
        </div>

        <div className="pixiyatra-dashboard-single-statistics-card">
          <h5>Wallet Balance</h5>
          <h2>$620.50</h2>
          <span>Top up now →</span>
        </div>

        <div className="pixiyatra-dashboard-single-statistics-card">
          <h5>Reward Points</h5>
          <h2>1,250</h2>
          <span>Redeem now →</span>
        </div>

      </div>

      {/* CONTENT */}

      <div className="pixiyatra-dashboard-content-main-grid">

        {/* LEFT */}

        <div className="pixiyatra-dashboard-left-content-panel">

          <div className="pixiyatra-dashboard-common-section-card">

            <div className="pixiyatra-dashboard-common-section-header">

              <h3>Upcoming Trips</h3>

              <a href="/">View All</a>

            </div>

            <div className="pixiyatra-dashboard-upcoming-trip-card">

              <img
                src="src/assets/images/dashboard_image/destination1.jpg"
                alt=""
              />

              <div>
                <h4>Paris, France</h4>
                <p>20 May - 27 May • 2 Travelers</p>
              </div>

              <span className="pixiyatra-dashboard-trip-status-badge pixiyatra-dashboard-trip-status-confirmed">
                Confirmed
              </span>

            </div>

            <div className="pixiyatra-dashboard-upcoming-trip-card">

              <img
                src="src/assets/images/dashboard_image/destination2.jpg"
                alt=""
              />

              <div>
                <h4>Bali, Indonesia</h4>
                <p>10 Jun - 15 Jun • 2 Travelers</p>
              </div>

              <span className="pixiyatra-dashboard-trip-status-badge pixiyatra-dashboard-trip-status-confirmed">
                Confirmed
              </span>

            </div>

            <div className="pixiyatra-dashboard-upcoming-trip-card">

              <img
                src="src/assets/images/dashboard_image/destination3.jpg"
                alt=""
              />

              <div>
                <h4>Dubai, UAE</h4>
                <p>05 Aug - 08 Aug • 1 Traveler</p>
              </div>

              <span className="pixiyatra-dashboard-trip-status-badge pixiyatra-dashboard-trip-status-pending">
                Pending
              </span>

            </div>

          </div>

        </div>

        {/* RIGHT */}

        <div className="pixiyatra-dashboard-right-content-panel">

          <div className="pixiyatra-dashboard-common-section-card">

            <div className="pixiyatra-dashboard-common-section-header">

              <h3>Popular Destinations</h3>

              <a href="/">View All</a>

            </div>

            <div className="pixiyatra-dashboard-popular-destination-wrapper">

              <div className="pixiyatra-dashboard-single-destination-card">

                <img
                  src="src/assets/images/dashboard_image/destination1.jpg"
                  alt=""
                />

                <span>Santorini</span>

              </div>

              <div className="pixiyatra-dashboard-single-destination-card">

                <img
                  src="src/assets/images/dashboard_image/destination2.jpg"
                  alt=""
                />

                <span>Tokyo</span>

              </div>

              <div className="pixiyatra-dashboard-single-destination-card">

                <img
                  src="src/assets/images/dashboard_image/destination3.jpg"
                  alt=""
                />

                <span>New York</span>

              </div>

            </div>

          </div>

          <div className="pixiyatra-dashboard-common-section-card pixiyatra-dashboard-special-offer-card">

            <h3>Top Offers For You</h3>

            <img
              src="src/assets/images/dashboard_image/destination1.jpg"
              alt=""
            />

            <div className="pixiyatra-dashboard-special-offer-details">

              <span className="pixiyatra-dashboard-offer-discount-badge">
                30% OFF
              </span>

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