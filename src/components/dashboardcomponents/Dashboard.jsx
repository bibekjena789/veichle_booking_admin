import React from "react";
import {
  FaPlane,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUsers,
  FaSearch,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

// Note: Ensure this CSS file path is correct for your project
import "../../css/Dashboard.css";

function Dashboard() {
  return (
    <div className="pixiyatra-dashboard-main-container">
      {/* HERO SECTION */}
      
      {/* STATS - Updated to match image totals */}
      <div className="pixiyatra-dashboard-statistics-grid-container">
        <div className="pixiyatra-dashboard-single-statistics-card">
          <h5>Total Bookings</h5>
          <h2>12,480</h2>
          <span>
            <FaArrowUp className="trend-up" /> +12.4% vs last month
          </span>
        </div>

        <div className="pixiyatra-dashboard-single-statistics-card">
          <h5>Total Vehicles</h5>
          <h2>248</h2>
          <span>
            <FaArrowUp className="trend-up" /> +3.1% vs last month
          </span>
        </div>

        <div className="pixiyatra-dashboard-single-statistics-card">
          <h5>Active Customers</h5>
          <h2>8,204</h2>
          <span>
            <FaArrowUp className="trend-up" /> +8.7% vs last month
          </span>
        </div>

        <div className="pixiyatra-dashboard-single-statistics-card">
          <h5>Monthly Revenue</h5>
          <h2>18.4L</h2>
          <span>
            <FaArrowDown className="trend-down" /> -2.3% vs last month
          </span>
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
                alt="Paris"
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
                alt="Bali"
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
                alt="Dubai"
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

          {/* Vehicle Categories - Added to match image */}
          <div className="pixiyatra-dashboard-common-section-card">
            <div className="pixiyatra-dashboard-common-section-header">
              <h3>Vehicle Categories</h3>
              <span className="pixiyatra-dashboard-legend-text">
                Share of active fleet
              </span>
            </div>
            <div className="pixiyatra-dashboard-vehicle-categories">
              <div className="pixiyatra-dashboard-category-item">
                <span className="category-dot sedan"></span>
                Sedan <span className="category-percent">38%</span>
              </div>
              <div className="pixiyatra-dashboard-category-item">
                <span className="category-dot suv"></span>
                SUV <span className="category-percent">27%</span>
              </div>
              <div className="pixiyatra-dashboard-category-item">
                <span className="category-dot tempo"></span>
                Tempo Traveller <span className="category-percent">18%</span>
              </div>
            </div>
            {/* Mini legend for chart reference */}
            <div className="pixiyatra-dashboard-chart-legend">
              <span>● Bookings</span>
              <span>● Revenue</span>
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
                  alt="Santorini"
                />
                <span>Santorini</span>
              </div>

              <div className="pixiyatra-dashboard-single-destination-card">
                <img
                  src="src/assets/images/dashboard_image/destination2.jpg"
                  alt="Tokyo"
                />
                <span>Tokyo</span>
              </div>

              <div className="pixiyatra-dashboard-single-destination-card">
                <img
                  src="src/assets/images/dashboard_image/destination3.jpg"
                  alt="New York"
                />
                <span>New York</span>
              </div>
            </div>
          </div>

          <div className="pixiyatra-dashboard-common-section-card pixiyatra-dashboard-special-offer-card">
            <h3>Top Offers For You</h3>
            <img
              src="src/assets/images/dashboard_image/destination1.jpg"
              alt="Maldives"
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