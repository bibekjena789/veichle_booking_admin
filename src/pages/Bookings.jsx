import React, { useState } from 'react';
import '../css/Bookings.css';
import { 
  FaCalendarAlt, 
  FaUser, 
  FaPlane, 
  FaHotel, 
  FaCar, 
  FaSearch,
  FaFilter,
  FaEye,
  FaEdit,
  FaTrash,
  FaDownload,
  FaPrint,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaChartBar,
  FaCreditCard,
  FaMoneyBillWave
} from 'react-icons/fa';

const Bookings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedRow, setExpandedRow] = useState(null);

  const bookings = [
    {
      id: 'BK24051289',
      type: 'Flight',
      customer: 'John Doe',
      status: 'Confirmed',
      amount: '$450.00',
      date: '20 May 2024',
      time: '10:30 AM',
      travelers: 2,
      payment: 'Paid',
      details: 'New York (JFK) → Paris (CDG)',
      icon: <FaPlane />
    },
    {
      id: 'BK24051290',
      type: 'Hotel',
      customer: 'Sarah Smith',
      status: 'Paid',
      amount: '$420.00',
      date: '18 May 2024',
      time: '02:00 PM',
      travelers: 2,
      payment: 'Paid',
      details: 'Grand Hotel Paris - 2 Nights',
      icon: <FaHotel />
    },
    {
      id: 'BK24051291',
      type: 'Package',
      customer: 'Mike Johnson',
      status: 'Confirmed',
      amount: '$1,250.00',
      date: '15 May 2024',
      time: '09:00 AM',
      travelers: 2,
      payment: 'Paid',
      details: 'Bali Paradise Package - 5 Days',
      icon: <FaPlane />
    },
    {
      id: 'BK24051292',
      type: 'Flight',
      customer: 'Emma Wilson',
      status: 'Pending',
      amount: '$780.00',
      date: '12 May 2024',
      time: '07:20 AM',
      travelers: 1,
      payment: 'Unpaid',
      details: 'London (LHR) → Dubai (DXB)',
      icon: <FaPlane />
    },
    {
      id: 'BK24051293',
      type: 'Vehicle',
      customer: 'Robert Brown',
      status: 'Cancelled',
      amount: '$780.00',
      date: '10 May 2024',
      time: '06:00 AM',
      travelers: 1,
      payment: 'Refunded',
      details: 'Luxury SUV - 3 Days Rental',
      icon: <FaCar />
    },
    {
      id: 'BK24051294',
      type: 'Hotel',
      customer: 'Lisa Anderson',
      status: 'Pending',
      amount: '$2,100.00',
      date: '08 May 2024',
      time: '06:00 AM',
      travelers: 2,
      payment: 'Unpaid',
      details: 'Beachfront Villa - 3 Nights',
      icon: <FaHotel />
    },
    {
      id: 'BK24051295',
      type: 'Package',
      customer: 'David Lee',
      status: 'Confirmed',
      amount: '$450.00',
      date: '05 May 2024',
      time: '10:30 AM',
      travelers: 2,
      payment: 'Paid',
      details: 'Weekend Getaway Package',
      icon: <FaPlane />
    },
    {
      id: 'BK24051296',
      type: 'Flight',
      customer: 'Maria Garcia',
      status: 'Paid',
      amount: '$620.00',
      date: '03 May 2024',
      time: '02:00 PM',
      travelers: 2,
      payment: 'Paid',
      details: 'Miami → Los Angeles',
      icon: <FaPlane />
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Confirmed': return 'status-confirmed';
      case 'Paid': return 'status-paid';
      case 'Pending': return 'status-pending';
      case 'Cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Confirmed': return <FaCheckCircle />;
      case 'Paid': return <FaCheckCircle />;
      case 'Pending': return <FaClock />;
      case 'Cancelled': return <FaTimesCircle />;
      default: return null;
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'Flight': return <FaPlane />;
      case 'Hotel': return <FaHotel />;
      case 'Vehicle': return <FaCar />;
      case 'Package': return <FaPlane />;
      default: return null;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || booking.type === filterType;
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  // Stats Data with React Icons
  const stats = [
    { label: 'Total Bookings', value: '2,568', change: '+12.5%', icon: <FaChartBar /> },
    { label: 'Total Refunds', value: '312', change: '+3.2%', icon: <FaCreditCard /> },
    { label: 'Active Bookings', value: '1,854', change: '+4.6%', icon: <FaCheckCircle /> },
    { label: 'Revenue', value: '$78,540', change: '+7.8%', icon: <FaMoneyBillWave /> },
  ];

  return (
    <div className="bookings-page">
      {/* Header */}
      <div className="bookings-header">
        <div className="header-left">
          <h1>Bookings</h1>
          <p className="breadcrumb">Home / Bookings / All Bookings</p>
        </div>
        <div className="header-actions">
          <button className="btn-export">
            <FaDownload /> Export
          </button>
          <button className="btn-print">
            <FaPrint /> Print
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div className="Booking-card" key={index}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-info">
              <h3>{stat.label}</h3>
              <p className="stat-number">{stat.value}</p>
              <span className="stat-change positive">{stat.change} from last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-bar">
          <FaSearch />
          <input
            type="text"
            placeholder="Search by customer or booking ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <div className="filter-item">
            <FaFilter />
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">All Booking Types</option>
              <option value="Flight">Flights</option>
              <option value="Hotel">Hotels</option>
              <option value="Package">Packages</option>
              <option value="Vehicle">Vehicles</option>
            </select>
          </div>

          <div className="filter-item">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="table-container">
        <table className="bookings-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Type</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <React.Fragment key={booking.id}>
                <tr className="booking-row" onClick={() => toggleRow(booking.id)}>
                  <td>
                    <span className="booking-id">{booking.id}</span>
                  </td>
                  <td>
                    <span className={`booking-type ${booking.type.toLowerCase()}`}>
                      {getTypeIcon(booking.type)}
                      {booking.type}
                    </span>
                  </td>
                  <td>
                    <div className="customer-info">
                      <FaUser className="customer-icon" />
                      {booking.customer}
                    </div>
                  </td>
                  <td>
                    <span className={`booking-status ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      {booking.status}
                    </span>
                  </td>
                  <td>{booking.amount}</td>
                  <td>
                    <div className="date-info">
                      <FaCalendarAlt />
                      {booking.date}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-action view" title="View">
                        <FaEye />
                      </button>
                      <button className="btn-action edit" title="Edit">
                        <FaEdit />
                      </button>
                      <button className="btn-action delete" title="Delete">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedRow === booking.id && (
                  <tr className="expanded-row">
                    <td colSpan="7">
                      <div className="expanded-content">
                        <div className="expanded-grid">
                          <div className="expanded-item">
                            <label>Booking ID</label>
                            <p>{booking.id}</p>
                          </div>
                          <div className="expanded-item">
                            <label>Booking Type</label>
                            <p>{booking.type}</p>
                          </div>
                          <div className="expanded-item">
                            <label>Status</label>
                            <p>{booking.status}</p>
                          </div>
                          <div className="expanded-item">
                            <label>Amount</label>
                            <p>{booking.amount}</p>
                          </div>
                          <div className="expanded-item">
                            <label>Date</label>
                            <p>{booking.date}</p>
                          </div>
                          <div className="expanded-item">
                            <label>Time</label>
                            <p>{booking.time}</p>
                          </div>
                          <div className="expanded-item">
                            <label>Travelers</label>
                            <p>{booking.travelers}</p>
                          </div>
                          <div className="expanded-item">
                            <label>Payment Status</label>
                            <p>{booking.payment}</p>
                          </div>
                          <div className="expanded-item full-width">
                            <label>Details</label>
                            <p>{booking.details}</p>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Bookings;