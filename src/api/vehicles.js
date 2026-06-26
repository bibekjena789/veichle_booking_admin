import axios from 'axios';
import API_CONFIG from './config';
import authService from './auth';

// Create axios instance with auth interceptor
const vehicleApi = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: 30000,
  headers: {
    'Content-Type': 'multipart/form-data',
  }
});

// Add auth token to requests
vehicleApi.interceptors.request.use(
  (config) => {
    const token = authService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

class VehicleService {
  /**
   * Get all vehicles with pagination and filters
   * @param {Object} params - Query parameters
   * @returns {Promise} Vehicle list
   */
  async getVehicles(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Pagination
      if (params.page) queryParams.append('page', params.page);
      if (params.pageSize) queryParams.append('page_size', params.pageSize);
      
      // Filters
      if (params.search) queryParams.append('search', params.search);
      if (params.company) queryParams.append('company', params.company);
      if (params.isActive !== undefined) queryParams.append('is_active', params.isActive);
      if (params.minPrice) queryParams.append('min_price', params.minPrice);
      if (params.maxPrice) queryParams.append('max_price', params.maxPrice);
      if (params.minSeat) queryParams.append('min_seat', params.minSeat);
      if (params.maxSeat) queryParams.append('max_seat', params.maxSeat);
      if (params.amenityId) queryParams.append('amenity_id', params.amenityId);
      if (params.ordering) queryParams.append('ordering', params.ordering);
      
      const url = `${API_CONFIG.endpoints.vehicles}?${queryParams.toString()}`;
      const response = await vehicleApi.get(url);
      
      return {
        success: true,
        data: response.data.data,
        pagination: response.data.pagination,
        message: response.data.message
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get single vehicle by ID
   * @param {string} id - Vehicle UUID
   * @returns {Promise} Vehicle details
   */
  async getVehicle(id) {
    try {
      const response = await vehicleApi.get(`${API_CONFIG.endpoints.vehicles}${id}/`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Create new vehicle
   * @param {FormData} formData - Vehicle data with images
   * @returns {Promise} Created vehicle
   */
  async createVehicle(formData) {
    try {
      const response = await vehicleApi.post(API_CONFIG.endpoints.vehicles, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Update vehicle
   * @param {string} id - Vehicle UUID
   * @param {FormData} formData - Updated vehicle data
   * @returns {Promise} Updated vehicle
   */
  async updateVehicle(id, formData) {
    try {
      const response = await vehicleApi.patch(
        `${API_CONFIG.endpoints.vehicles}${id}/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );
      
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Delete vehicle
   * @param {string} id - Vehicle UUID
   * @returns {Promise} Deletion confirmation
   */
  async deleteVehicle(id) {
    try {
      const response = await vehicleApi.delete(`${API_CONFIG.endpoints.vehicles}${id}/`);
      return {
        success: true,
        message: response.data.message || 'Vehicle deleted successfully'
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get all amenities
   * @returns {Promise} List of amenities
   */
  async getAmenities() {
    try {
      const response = await vehicleApi.get(API_CONFIG.endpoints.amenities);
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Handle API errors
   */
  handleError(error) {
    if (error.response) {
      const { status, data } = error.response;
      
      console.error('Vehicle API Error:', { status, data });
      
      let message = 'An error occurred';
      
      if (data) {
        // Handle field-specific errors
        if (typeof data === 'object') {
          const errors = [];
          for (const [key, value] of Object.entries(data)) {
            if (Array.isArray(value)) {
              errors.push(`${key}: ${value.join(', ')}`);
            } else if (typeof value === 'string') {
              errors.push(value);
            } else if (typeof value === 'object') {
              errors.push(JSON.stringify(value));
            }
          }
          if (errors.length > 0) {
            message = errors.join('; ');
          }
        } else if (typeof data === 'string') {
          message = data;
        } else if (data.message) {
          message = data.message;
        } else if (data.detail) {
          message = data.detail;
        }
      }
      
      return {
        success: false,
        message: message,
        status: status,
        errors: data
      };
    } else if (error.request) {
      return {
        success: false,
        message: 'Network error. Please check your connection.',
        status: 0
      };
    } else {
      return {
        success: false,
        message: error.message || 'An unexpected error occurred',
        status: -1
      };
    }
  }
}

const vehicleService = new VehicleService();
export default vehicleService;