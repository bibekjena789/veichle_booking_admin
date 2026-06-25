import React, { useState } from 'react';
import '../css/Reviews.css';
import { 
  FaStar, 
  FaSearch, 
  FaFilter, 
  FaUser, 
  FaCalendarAlt,
  FaThumbsUp,
  FaThumbsDown,
  FaReply,
  FaTrash,
  FaEye,
  FaChevronDown,
  FaChevronUp,
  FaDownload,
  FaPrint
} from 'react-icons/fa';

const Reviews = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedReview, setExpandedReview] = useState(null);

  const reviews = [
    {
      id: 1,
      user: 'John Doe',
      avatar: 'JD',
      rating: 5,
      date: '20 May 2024',
      service: 'Flight Booking',
      title: 'Amazing experience!',
      comment: 'The flight booking process was incredibly smooth. The staff was very helpful and the prices were competitive. Highly recommend!',
      status: 'Published',
      likes: 24,
      dislikes: 2,
      replies: 3,
      replied: false
    },
    {
      id: 2,
      user: 'Sarah Smith',
      avatar: 'SS',
      rating: 4,
      date: '18 May 2024',
      service: 'Hotel Booking',
      title: 'Great hotel stay',
      comment: 'The hotel was exactly as described. Clean rooms, friendly staff, and excellent location. Will definitely book again.',
      status: 'Published',
      likes: 18,
      dislikes: 1,
      replies: 2,
      replied: false
    },
    {
      id: 3,
      user: 'Mike Johnson',
      avatar: 'MJ',
      rating: 3,
      date: '15 May 2024',
      service: 'Package Tour',
      title: 'Good but could be better',
      comment: 'The tour was well organized but the accommodation could have been better. Expected more for the price paid.',
      status: 'Pending',
      likes: 8,
      dislikes: 5,
      replies: 0,
      replied: false
    },
    {
      id: 4,
      user: 'Emma Wilson',
      avatar: 'EW',
      rating: 5,
      date: '12 May 2024',
      service: 'Vehicle Rental',
      title: 'Excellent service!',
      comment: 'The car was in perfect condition and the rental process was very quick. Great value for money.',
      status: 'Published',
      likes: 32,
      dislikes: 0,
      replies: 5,
      replied: false
    },
    {
      id: 5,
      user: 'Robert Brown',
      avatar: 'RB',
      rating: 2,
      date: '10 May 2024',
      service: 'Flight Booking',
      title: 'Disappointing experience',
      comment: 'The flight was delayed and the customer service was unhelpful. Not happy with the overall experience.',
      status: 'Flagged',
      likes: 3,
      dislikes: 12,
      replies: 1,
      replied: false
    },
    {
      id: 6,
      user: 'Lisa Anderson',
      avatar: 'LA',
      rating: 4,
      date: '08 May 2024',
      service: 'Hotel Booking',
      title: 'Comfortable stay',
      comment: 'Good hotel with nice amenities. The breakfast buffet was excellent. Would recommend to others.',
      status: 'Published',
      likes: 15,
      dislikes: 2,
      replies: 1,
      replied: false
    }
  ];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar 
        key={index} 
        className={index < rating ? 'star filled' : 'star empty'} 
      />
    ));
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'Published': return 'status-published';
      case 'Pending': return 'status-pending';
      case 'Flagged': return 'status-flagged';
      default: return '';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Published': return <FaThumbsUp />;
      case 'Pending': return <FaChevronDown />;
      case 'Flagged': return <FaThumbsDown />;
      default: return null;
    }
  };

  const toggleExpand = (id) => {
    setExpandedReview(expandedReview === id ? null : id);
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = filterRating === 'all' || review.rating === parseInt(filterRating);
    const matchesStatus = filterStatus === 'all' || review.status === filterStatus;
    return matchesSearch && matchesRating && matchesStatus;
  });

  // Stats Data
  const stats = [
    { label: 'Total Reviews', value: '1,247', change: '+8.5%', icon: '⭐' },
    { label: 'Average Rating', value: '4.6', change: '+0.3', icon: '📊' },
    { label: 'Positive Reviews', value: '892', change: '+12.3%', icon: '👍' },
    { label: 'Flagged Reviews', value: '45', change: '-2.1%', icon: '🚩' },
  ];

  return (
    <div className="reviews-page">
      {/* Header */}
      <div className="reviews-header">
        <div className="header-left">
          <h1>Reviews</h1>
          <p className="breadcrumb">Home / Reviews / All Reviews</p>
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
          <div className="stat-card" key={index}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-info">
              <h3>{stat.label}</h3>
              <p className="stat-number">{stat.value}</p>
              <span className={`stat-change ${stat.change.startsWith('+') ? 'positive' : 'negative'}`}>
                {stat.change} from last month
              </span>
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
            placeholder="Search by user, title or comment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <div className="filter-item">
            <FaFilter />
            <select value={filterRating} onChange={(e) => setFilterRating(e.target.value)}>
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>

          <div className="filter-item">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="Published">Published</option>
              <option value="Pending">Pending</option>
              <option value="Flagged">Flagged</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="reviews-container">
        {filteredReviews.map((review) => (
          <div key={review.id} className="review-card">
            <div className="review-header" onClick={() => toggleExpand(review.id)}>
              <div className="review-user">
                <div className="user-avatar">{review.avatar}</div>
                <div className="user-info">
                  <h4>{review.user}</h4>
                  <div className="review-meta">
                    <span className="service-type">{review.service}</span>
                    <span className="review-date">
                      <FaCalendarAlt /> {review.date}
                    </span>
                  </div>
                </div>
              </div>

              <div className="review-rating">
                <div className="stars">{renderStars(review.rating)}</div>
                <span className={`review-status ${getStatusClass(review.status)}`}>
                  {getStatusIcon(review.status)}
                  {review.status}
                </span>
              </div>

              <button className="expand-btn">
                {expandedReview === review.id ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            </div>

            <div className="review-body">
              <h4 className="review-title">{review.title}</h4>
              <p className="review-comment">{review.comment}</p>

              <div className="review-actions">
                <div className="review-interactions">
                  <button className="interact-btn like">
                    <FaThumbsUp /> {review.likes}
                  </button>
                  <button className="interact-btn dislike">
                    <FaThumbsDown /> {review.dislikes}
                  </button>
                  <span className="reply-count">
                    <FaReply /> {review.replies} Replies
                  </span>
                </div>

                <div className="review-admin-actions">
                  <button className="admin-btn view" title="View Details">
                    <FaEye />
                  </button>
                  <button className="admin-btn reply" title="Reply">
                    <FaReply />
                  </button>
                  <button className="admin-btn delete" title="Delete">
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedReview === review.id && (
              <div className="review-expanded">
                <div className="expanded-content">
                  <div className="expanded-row">
                    <div className="expanded-item">
                      <label>Review ID</label>
                      <p>#REV{String(review.id).padStart(4, '0')}</p>
                    </div>
                    <div className="expanded-item">
                      <label>Service Type</label>
                      <p>{review.service}</p>
                    </div>
                    <div className="expanded-item">
                      <label>Rating</label>
                      <p>{review.rating}/5 Stars</p>
                    </div>
                    <div className="expanded-item">
                      <label>Status</label>
                      <p className={`status-text ${review.status.toLowerCase()}`}>
                        {review.status}
                      </p>
                    </div>
                  </div>
                  <div className="expanded-row">
                    <div className="expanded-item full-width">
                      <label>Full Review</label>
                      <p className="full-comment">{review.comment}</p>
                    </div>
                  </div>
                  <div className="expanded-row">
                    <div className="expanded-item">
                      <label>Likes</label>
                      <p>{review.likes}</p>
                    </div>
                    <div className="expanded-item">
                      <label>Dislikes</label>
                      <p>{review.dislikes}</p>
                    </div>
                    <div className="expanded-item">
                      <label>Total Replies</label>
                      <p>{review.replies}</p>
                    </div>
                    <div className="expanded-item">
                      <label>Date</label>
                      <p>{review.date}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;