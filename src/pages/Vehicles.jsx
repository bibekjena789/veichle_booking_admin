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
  FaFilter,
  FaSpinner,
  FaExclamationTriangle,
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
    type: 'all',
    minPrice: '',
    maxPrice: '',
    minSeat: '',
    maxSeat: ''
  });
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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
      if (filters.status !== 'all') {
        params.isActive = filters.status === 'active';
      }
      if (filters.minPrice) params.minPrice = parseFloat(filters.minPrice);
      if (filters.maxPrice) params.maxPrice = parseFloat(filters.maxPrice);
      if (filters.minSeat) params.minSeat = parseInt(filters.minSeat);
      if (filters.maxSeat) params.maxSeat = parseInt(filters.maxSeat);
      
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

  // Get status badge
  const getStatusBadge = (status) => {
    const statusMap = {
      'Active': 'active',
      'Under Maintenance': 'maintenance',
      'Inactive': 'inactive'
    };
    return statusMap[status] || 'active';
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
<<<<<<< HEAD
             <button className="add-btn">+ Add Vehicle</button>
{/* Status Filter */}
<select className="filter-select">
  <option value="all">All Status</option>
  <option value="active">Active</option>
  <option value="maintenance">Under Maintenance</option>
  <option value="inactive">Inactive</option>
</select>

{/* Vehicle Type Filter */}
<select className="filter-select">
  <option value="all">All Types</option>
  <option value="suv">SUV</option>
  <option value="sedan">Sedan</option>
  <option value="hatchback">Hatchback</option>
  <option value="van">Van</option>
  <option value="luxury">Luxury</option>
  <option value="electric">Electric</option>
</select>

<button className="filter-btn1">
  Filter
</button>
            <button className="filter-btn1">
              Filter
=======
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
>>>>>>> be4d0a5105db8495ef322934ba94a8539267a34a
            </button>
          </div>
        </div>

        <div className="table-wrapper1">
          <table>
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Type</th>
                <th>Plate Number</th>
                <th>Capacity</th>
                <th>Year</th>
                <th>Status</th>
                <th>Last Service</th>
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
                          <span>{vehicle.veichle_description || `${vehicle.total_number_of_sheat} Seater`}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="type-badge1">
                        {vehicle.vehicle_type || 'N/A'}
                      </span>
                    </td>
                    <td>{vehicle.veichle_number}</td>
                    <td>
                      <FaUserFriends /> {vehicle.total_number_of_sheat}
                    </td>
                    <td>{vehicle.model_year || 'N/A'}</td>
                    <td>
                      <span className={`status ${getStatusBadge(vehicle.is_active ? 'Active' : 'Inactive')}`}>
                        {vehicle.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{vehicle.last_service_date || 'N/A'}</td>
                    <td>
                      <div className="actions1">
                        <FaEye 
                          className="action-icon view" 
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
    </div>
  );
}

export default Vehicles;