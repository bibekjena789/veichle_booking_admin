import React, { useState, useEffect, useCallback } from "react";
import {
  FaCar,
  FaCheckCircle,
  FaTools,
  FaTimesCircle,
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaSpinner,
  FaExclamationTriangle,
  FaStar,
  FaUserFriends,
  FaFilter,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
import '../../css/vehicle/Vehicles.css';
import vehicleService from '../../api/vehicles';
import VehicleModal from '../VehicleModal';
import DeleteConfirmModal from '../DeleteConfirmModal';

function Vehicles() {
  // State
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    maintenance: 0,
    inactive: 0
  });
  
  // Pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPages: 0,
    totalRecords: 0,
    hasNext: false,
    hasPrevious: false
  });
  
  // Filters
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    company: '',
    minPrice: '',
    maxPrice: '',
    minSeat: '',
    maxSeat: ''
  });
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  
  // Amenities
  const [amenities, setAmenities] = useState([]);
  const [loadingAmenities, setLoadingAmenities] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Admin state
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Toggle loading state
  const [togglingVehicleId, setTogglingVehicleId] = useState(null);

  // Check if user is admin
  useEffect(() => {
    setIsAdmin(vehicleService.isAdmin());
  }, []);

  // Fetch vehicles
  const fetchVehicles = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        page: page,
        pageSize: pagination.pageSize,
        ordering: '-created_at'
      };
      
      if (filters.search) params.search = filters.search;
      if (filters.company) params.company = filters.company;
      if (filters.status !== 'all') {
        params.is_active = filters.status === 'active';
      }
      if (filters.minPrice) params.min_price = parseFloat(filters.minPrice);
      if (filters.maxPrice) params.max_price = parseFloat(filters.maxPrice);
      if (filters.minSeat) params.min_seat = parseInt(filters.minSeat);
      if (filters.maxSeat) params.max_seat = parseInt(filters.maxSeat);
      
      const result = await vehicleService.getVehicles(params);
      
      if (result.success) {
        setVehicles(result.data || []);
        if (result.pagination) {
          setPagination(prev => ({
            ...prev,
            currentPage: result.pagination.current_page || page,
            totalPages: result.pagination.total_pages || 0,
            totalRecords: result.pagination.total_records || 0,
            hasNext: result.pagination.has_next || false,
            hasPrevious: result.pagination.has_previous || false
          }));
        }
        updateStats(result.data || []);
      } else {
        setError(result.message || 'Failed to fetch vehicles');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Fetch vehicles error:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.pageSize]);

  // Fetch amenities
  const fetchAmenities = async () => {
    setLoadingAmenities(true);
    try {
      const result = await vehicleService.getAmenities();
      if (result.success) {
        setAmenities(result.data || []);
      }
    } catch (error) {
      console.error('Fetch amenities error:', error);
    } finally {
      setLoadingAmenities(false);
    }
  };

  // Update stats
  const updateStats = (data) => {
    const total = data.length;
    const active = data.filter(v => v.is_active === true).length;
    const inactive = data.filter(v => v.is_active === false).length;
    const maintenance = data.filter(v => v.status === 'Under Maintenance').length || 0;
    
    setStats({
      total,
      active,
      maintenance,
      inactive
    });
  };

  // Load data on mount and filter change
  useEffect(() => {
    fetchVehicles();
    fetchAmenities();
  }, [fetchVehicles]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchVehicles(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters.search]);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchVehicles(newPage);
    }
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    if (key !== 'search') {
      fetchVehicles(1);
    }
  };

  // Handle add vehicle
  const handleAddVehicle = async (formData) => {
    setModalLoading(true);
    try {
      const result = await vehicleService.createVehicle(formData);
      if (result.success) {
        setShowAddModal(false);
        fetchVehicles(pagination.currentPage);
        return { success: true };
      } else {
        return { success: false, errors: result.errors };
      }
    } catch (error) {
      return { success: false, message: 'Failed to create vehicle' };
    } finally {
      setModalLoading(false);
    }
  };

  // Handle edit vehicle
  const handleEditVehicle = async (id, formData) => {
    setModalLoading(true);
    try {
      const result = await vehicleService.updateVehicle(id, formData);
      if (result.success) {
        setShowEditModal(false);
        setSelectedVehicle(null);
        fetchVehicles(pagination.currentPage);
        return { success: true };
      } else {
        return { success: false, errors: result.errors };
      }
    } catch (error) {
      return { success: false, message: 'Failed to update vehicle' };
    } finally {
      setModalLoading(false);
    }
  };

  // Handle delete vehicle
  const handleDeleteVehicle = async (id) => {
    setModalLoading(true);
    try {
      const result = await vehicleService.deleteVehicle(id);
      if (result.success) {
        setShowDeleteModal(false);
        setSelectedVehicle(null);
        fetchVehicles(pagination.currentPage);
        return { success: true };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      return { success: false, message: 'Failed to delete vehicle' };
    } finally {
      setModalLoading(false);
    }
  };

  // Handle quick status toggle from card
  const handleQuickStatusToggle = async (vehicle) => {
    setTogglingVehicleId(vehicle.id);
    try {
      const formData = new FormData();
      formData.append('is_active', !vehicle.is_active ? 'true' : 'false');
      
      const result = await vehicleService.updateVehicle(vehicle.id, formData);
      if (result.success) {
        // Update the vehicle in the list
        setVehicles(prevVehicles => 
          prevVehicles.map(v => 
            v.id === vehicle.id 
              ? { ...v, is_active: !v.is_active }
              : v
          )
        );
        // Update stats
        updateStats(vehicles.map(v => 
          v.id === vehicle.id 
            ? { ...v, is_active: !v.is_active }
            : v
        ));
        return { success: true };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      return { success: false, message: 'Failed to update status' };
    } finally {
      setTogglingVehicleId(null);
    }
  };

  // Handle status toggle from view modal
  const handleStatusToggle = async (vehicleId, currentStatus) => {
    try {
      const formData = new FormData();
      formData.append('is_active', !currentStatus ? 'true' : 'false');
      
      const result = await vehicleService.updateVehicle(vehicleId, formData);
      if (result.success) {
        // Refresh the vehicles list
        await fetchVehicles(pagination.currentPage);
        return { success: true };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      return { success: false, message: 'Failed to update status' };
    }
  };

  // Open edit modal
  const openEditModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowEditModal(true);
  };

  // Open delete modal
  const openDeleteModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowDeleteModal(true);
  };

  // Open view modal
  const openViewModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowViewModal(true);
  };

  // Get status badge
  const getStatusBadge = (isActive) => {
    return isActive ? 'active' : 'inactive';
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  // Generate stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`star-${i}`} className="star-filled" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStar key="half-star" className="star-half" />);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="star-empty" />);
    }
    return stars;
  };

  // Render loading state
  if (loading && vehicles.length === 0) {
    return (
      <div className="loading-container">
        <FaSpinner className="spinner" />
        <p>Loading vehicles...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="error-container">
        <FaExclamationTriangle className="error-icon" />
        <h3>Error Loading Vehicles</h3>
        <p>{error}</p>
        <button onClick={() => fetchVehicles()} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="vehicles-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-left">
          <h1>Vehicles</h1>
          <p className="header-subtitle">Manage your fleet, availability and pricing across all categories.</p>
        </div>
        <button className="add-btn-primary" onClick={() => setShowAddModal(true)}>
          <FaPlus /> Add Vehicle
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card card1">
          <FaCar className="icon blue" />
          <div>
            <span>Total Vehicles</span>
            <h2>{stats.total}</h2>
          </div>
        </div>

        <div className="stat-card card2">
          <FaCheckCircle className="icon green" />
          <div>
            <span>Active Vehicles</span>
            <h2>{stats.active}</h2>
          </div>
        </div>

        <div className="stat-card card3">
          <FaTools className="icon purple" />
          <div>
            <span>Under Maintenance</span>
            <h2>{stats.maintenance}</h2>
          </div>
        </div>

        <div className="stat-card card4">
          <FaTimesCircle className="icon red" />
          <div>
            <span>Inactive Vehicles</span>
            <h2>{stats.inactive}</h2>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="search-filter-section">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search vehicles..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
        </div>
        <button 
          className="filter-toggle-btn"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FaFilter /> Filters
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="filter-panel">
          <div className="filter-group">
            <label>Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Min Price (₹)</label>
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label>Max Price (₹)</label>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label>Min Seats</label>
            <input
              type="number"
              placeholder="Min"
              value={filters.minSeat}
              onChange={(e) => handleFilterChange('minSeat', e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label>Max Seats</label>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxSeat}
              onChange={(e) => handleFilterChange('maxSeat', e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Vehicle Cards Grid */}
      <div className="vehicles-grid">
        {vehicles.length === 0 ? (
          <div className="no-vehicles">
            <p>No vehicles found</p>
          </div>
        ) : (
          vehicles.map((vehicle) => {
            // Get the image URL for the card background
            const imageUrl = vehicle.images && vehicle.images.length > 0
              ? vehicle.images[0].image
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(vehicle.veichle_name)}&size=400&background=0ea5a4&color=fff&bold=true`;
            
            const isToggling = togglingVehicleId === vehicle.id;
            
            return (
              <div 
                key={vehicle.id} 
                className="vehicle-card"
                style={{
                  '--bg-image': `url(${imageUrl})`
                }}
              >
                {/* Background image using inline style */}
                <style>{`
                  .vehicle-card[style*="--bg-image"]::before {
                    background-image: var(--bg-image);
                  }
                `}</style>
                
                {/* Action Buttons */}
                <div className="vehicle-card-header">
                  <button 
                    className="action-btn view-btn"
                    onClick={() => openViewModal(vehicle)}
                    title="View Details"
                  >
                    <FaEye />
                  </button>
                  <button 
                    className="action-btn edit-btn"
                    onClick={() => openEditModal(vehicle)}
                    title="Edit Vehicle"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => openDeleteModal(vehicle)}
                    title="Delete Vehicle"
                  >
                    <FaTrash />
                  </button>
                </div>

                {/* Card Content */}
                <div className="vehicle-card-content">
                  <h3 className="vehicle-name">{vehicle.veichle_name}</h3>
                  
                  <div className="vehicle-meta">
                    <span className="meta-item">
                      <FaUserFriends className="meta-icon" />
                      {vehicle.total_number_of_sheat || 0} seats
                    </span>
                    <span className="meta-item rating">
                      {renderStars(vehicle.rating || 4.5)}
                      <span className="rating-value">{vehicle.rating || 4.5}</span>
                    </span>
                  </div>

                  <div className="vehicle-price">
                    <span className="price-amount">₹{vehicle.price_per_km || 0}</span>
                    <span className="price-unit"> /per km</span>
                  </div>

                  <div className="vehicle-card-footer">
                    <div className="vehicle-status-wrapper">
                      {/* Status Dot and Text */}
                      <div className="vehicle-status">
                        <span className={`status-dot ${getStatusBadge(vehicle.is_active)}`}></span>
                        <span className="status-text">
                          {vehicle.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      {/* Toggle Switch - Always visible */}
                      <button
                        className={`toggle-switch ${vehicle.is_active ? 'active' : 'inactive'}`}
                        onClick={() => handleQuickStatusToggle(vehicle)}
                        disabled={isToggling}
                        title={vehicle.is_active ? 'Click to deactivate' : 'Click to activate'}
                      >
                        {isToggling ? (
                          <FaSpinner className="spinner-small" />
                        ) : vehicle.is_active ? (
                          <>
                            <FaToggleOn className="toggle-icon" />
                            <span className="toggle-label">Active</span>
                          </>
                        ) : (
                          <>
                            <FaToggleOff className="toggle-icon" />
                            <span className="toggle-label">Inactive</span>
                          </>
                        )}
                      </button>
                    </div>
                    
                    <button 
                      className="view-details-btn"
                      onClick={() => openViewModal(vehicle)}
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPrevious}
            className="page-btn"
          >
            Previous
          </button>
          <span className="page-info">
            Page {pagination.currentPage} of {pagination.totalPages}
            <span className="total-records">
              ({pagination.totalRecords} vehicles)
            </span>
          </span>
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNext}
            className="page-btn"
          >
            Next
          </button>
        </div>
      )}

      {/* Modals */}
      {/* Add Vehicle Modal */}
      <VehicleModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddVehicle}
        loading={modalLoading}
        amenities={amenities}
        title="Add New Vehicle"
        submitText="Create Vehicle"
        isViewMode={false}
        isAdmin={isAdmin}
      />

      {/* Edit Vehicle Modal */}
      <VehicleModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedVehicle(null);
        }}
        onSubmit={(data) => handleEditVehicle(selectedVehicle?.id, data)}
        loading={modalLoading}
        amenities={amenities}
        vehicle={selectedVehicle}
        title="Edit Vehicle"
        submitText="Update Vehicle"
        isViewMode={false}
        isAdmin={isAdmin}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedVehicle(null);
        }}
        onConfirm={() => handleDeleteVehicle(selectedVehicle?.id)}
        loading={modalLoading}
        vehicleName={selectedVehicle?.veichle_name}
      />

      {/* View Vehicle Modal */}
      <VehicleModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedVehicle(null);
        }}
        onSubmit={async (data) => {
          // Handle status toggle from view mode
          if (selectedVehicle) {
            const result = await handleStatusToggle(selectedVehicle.id, selectedVehicle.is_active);
            if (result.success) {
              // Update the selected vehicle's status locally
              setSelectedVehicle(prev => ({
                ...prev,
                is_active: !prev.is_active
              }));
              return result;
            }
            return result;
          }
          return { success: false };
        }}
        loading={modalLoading}
        amenities={amenities}
        vehicle={selectedVehicle}
        title="Vehicle Details"
        submitText=""
        isViewMode={true}
        isAdmin={isAdmin}
      />
    </div>
  );
}

export default Vehicles;