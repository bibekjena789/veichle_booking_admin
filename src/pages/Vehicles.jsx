import React, { useState, useEffect, useCallback } from "react";
import {
  FaCar,
  FaCheckCircle,
  FaTools,
  FaTimesCircle,
  FaEye,
  FaEdit,
  FaTrash,
  FaEllipsisV,
  FaUserFriends,
  FaPlus,
  FaSearch,
  FaSpinner,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaTag,
  FaBuilding,
} from "react-icons/fa";
import '../css/vehicle/Vehicles.css';
import vehicleService from '../api/vehicles';
import VehicleModal from '../components/VehicleModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

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
      
      // Add filters
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
    // Under maintenance is a status from the data
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

  // Get amenity names
  const getAmenityNames = (amenities) => {
    if (!amenities || amenities.length === 0) return 'None';
    return amenities.map(a => a.amenity).join(', ');
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

      {/* Table Section */}
      <div className="table-card1">
        <div className="table-top1">
          <h2>All Vehicles</h2>

          <div className="filters1">

              
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search by name, number, company..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>

            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <button className="add-btn" onClick={() => setShowAddModal(true)}>
              <FaPlus /> Add Vehicle
            </button>
          </div>
        </div>

        <div className="table-wrapper1">
          <table>
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Company</th>
                <th>Plate Number</th>
                <th>Price/Km</th>
                <th>Seats</th>
                <th>Status</th>
                <th>Amenities</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.length === 0 ? (
                <tr>
                  <td colSpan="8" className="no-data">
                    <p>No vehicles found</p>
                  </td>
                </tr>
              ) : (
                vehicles.map((vehicle, index) => (
                  <tr key={vehicle.id || index}>
                    <td>
                      <div className="vehicle-info">
                        <img
                          src={
                            vehicle.images && vehicle.images.length > 0
                              ? vehicle.images[0].image
                              : `https://ui-avatars.com/api/?name=${encodeURIComponent(vehicle.veichle_name)}&size=50&background=667eea&color=fff`
                          }
                          alt={vehicle.veichle_name}
                          className="vehicle-img"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(vehicle.veichle_name)}&size=50&background=667eea&color=fff`;
                          }}
                        />
                        <div>
                          <h4>{vehicle.veichle_name}</h4>
                          <span className="vehicle-desc">
                            {vehicle.veichle_description || `${vehicle.total_number_of_sheat} Seater`}
                          </span>
                          <span className="vehicle-id">
                            ID: {vehicle.id?.substring(0, 8) || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="company-info">
                        <FaBuilding className="company-icon" />
                        <span>{vehicle.compeny_name || 'N/A'}</span>
                      </div>
                    </td>
                    <td>
                      <span className="plate-number">{vehicle.veichle_number || 'N/A'}</span>
                    </td>
                    <td>
                      <div className="price-info">
                        <FaTag className="price-icon" />
                        <span>₹{vehicle.price_per_km || 0}/km</span>
                      </div>
                    </td>
                    <td>
                      <div className="seat-info">
                        <FaUserFriends className="seat-icon" />
                        <span>{vehicle.total_number_of_sheat || 0}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`status ${getStatusBadge(vehicle.is_active)}`}>
                        {vehicle.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <span className="status-date">
                        <FaCalendarAlt className="date-icon" />
                        {formatDate(vehicle.updated_at)}
                      </span>
                    </td>
                    <td>
                      <div className="amenities-list">
                        {vehicle.amenities && vehicle.amenities.length > 0 ? (
                          <>
                            {vehicle.amenities.slice(0, 2).map((amenity, idx) => (
                              <span key={idx} className="amenity-tag">
                                {amenity.amenity}
                              </span>
                            ))}
                            {vehicle.amenities.length > 2 && (
                              <span className="amenity-count">
                                +{vehicle.amenities.length - 2}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="no-amenities">None</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="actions1">
                        <FaEye 
                          className="action-icon view" 
                          onClick={() => openViewModal(vehicle)}
                          title="View Details"
                        />
                        <FaEdit 
                          className="action-icon edit" 
                          onClick={() => openEditModal(vehicle)}
                          title="Edit Vehicle"
                        />
                        <FaTrash 
                          className="action-icon delete" 
                          onClick={() => openDeleteModal(vehicle)}
                          title="Delete Vehicle"
                        />
                        <FaEllipsisV className="action-icon more" title="More" />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
      </div>

      {/* Modals */}
      <VehicleModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddVehicle}
        loading={modalLoading}
        amenities={amenities}
        title="Add New Vehicle"
        submitText="Create Vehicle"
      />

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
      />

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
{/* View Vehicle Modal */}
{showViewModal && selectedVehicle && (
  <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
    <div className="modal-content view-modal" onClick={(e) => e.stopPropagation()}>
      {/* Sticky Header - Always visible */}
      <div className="modal-sticky-header">
        <div className="modal-header-top">
          <h2>Vehicle Details</h2>
          <button className="modal-close" onClick={() => setShowViewModal(false)}>×</button>
        </div>
        
        {/* Vehicle Main Info - Stays on top */}
        <div className="vehicle-main-info">
          <div className="vehicle-avatar">
            <img
              src={
                selectedVehicle.images && selectedVehicle.images.length > 0
                  ? selectedVehicle.images[0].image
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedVehicle.veichle_name)}&size=80&background=0ea5a4&color=fff&bold=true`
              }
              alt={selectedVehicle.veichle_name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedVehicle.veichle_name)}&size=80&background=0ea5a4&color=fff&bold=true`;
              }}
            />
            <div className="vehicle-name-info">
              <h3>{selectedVehicle.veichle_name}</h3>
              <p className="vehicle-company">{selectedVehicle.compeny_name}</p>
              <p className="vehicle-plate">{selectedVehicle.veichle_number}</p>
            </div>
          </div>
          <div className="vehicle-status-badge">
            <span className={`status-badge ${selectedVehicle.is_active ? 'active' : 'inactive'}`}>
              <span className="dot"></span>
              {selectedVehicle.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      {/* Scrollable Body - Only this part scrolls */}
      <div className="modal-scrollable-body">
        <div className="view-vehicle-details">
          {/* Details Grid */}
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Price per KM</span>
              <span className="detail-value">₹{selectedVehicle.price_per_km || 0}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Seats</span>
              <span className="detail-value">{selectedVehicle.total_number_of_sheat || 0}</span>
            </div>
            <div className="detail-item full-width">
              <span className="detail-label">Description</span>
              <span className="detail-value">{selectedVehicle.veichle_description || 'No description'}</span>
            </div>
            <div className="detail-item full-width">
              <span className="detail-label">Amenities</span>
              <div className="detail-amenities">
                {selectedVehicle.amenities && selectedVehicle.amenities.length > 0 ? (
                  selectedVehicle.amenities.map((amenity, idx) => (
                    <span key={idx} className="amenity-tag">{amenity.amenity}</span>
                  ))
                ) : (
                  <span className="no-amenities">No amenities</span>
                )}
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-label">Added By</span>
              <span className="detail-value">{selectedVehicle.added_by || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Created At</span>
              <span className="detail-value">{formatDate(selectedVehicle.created_at)}</span>
            </div>
          </div>

          
        </div>
      </div>

      {/* Footer - Always visible */}
      <div className="modal-footer">
        <button className="btn-close" onClick={() => setShowViewModal(false)}>
          Close
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default Vehicles;