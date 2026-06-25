import axios from 'axios';
import API_CONFIG from './config';
import encryptionService from '../utils/encryption';

// Create axios instance
const authApi = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor for logging
authApi.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

class AuthService {
  // Login with Email or Phone
  async login(identifier, password) {
    try {
      const payload = { 
        identifier: identifier,
        password: password 
      };
      
      const response = await authApi.post(API_CONFIG.endpoints.login, payload);
      
      console.log('Login response status:', response.status);
      
      if (response.status === 200 || response.status === 201) {
        const data = response.data;
        
        if (data.status === true) {
          const tokens = {
            access: data.tokens?.access,
            refresh: data.tokens?.refresh
          };
          
          const userData = data.data;
          
          if (tokens.access) {
            // Store encrypted data in sessionStorage
            this.storeEncryptedSessionData(tokens, userData, data);
            
            
            return {
              success: true,
              data: userData,
              tokens: tokens,
              message: data.message || 'Login successful'
            };
          } else {
            console.error('No access token in response:', data);
            return {
              success: false,
              message: 'Invalid response from server. No token received.'
            };
          }
        } else {
          return {
            success: false,
            message: data.message || 'Login failed'
          };
        }
      }
      
      return {
        success: false,
        message: 'Login failed. Please check your credentials.'
      };
      
    } catch (error) {
      console.error('Login error:', error);
      return this.handleError(error);
    }
  }

  // Store encrypted session data
  storeEncryptedSessionData(tokens, userData, responseData) {
    try {
      // Store tokens encrypted
      encryptionService.setToken('access_token', tokens.access);
      encryptionService.setToken('refresh_token', tokens.refresh);
      
      // Store user data encrypted
      const userDataToStore = {
        user_id: userData.user_id,
        uuid: userData.uuid,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        is_active: userData.is_active,
        is_staff: userData.is_staff,
        is_superuser: userData.is_superuser,
        last_ip: userData.last_ip,
        last_device: userData.last_device,
        created_at: userData.created_at,
        updated_at: userData.updated_at
      };
      
      encryptionService.setUserData(userDataToStore);
      
      // Store individual user fields for easy access
      encryptionService.setSessionItem('user_role', userData.role);
      encryptionService.setSessionItem('user_name', userData.name);
      encryptionService.setSessionItem('user_email', userData.email);
      encryptionService.setSessionItem('user_phone', userData.phone);
      encryptionService.setSessionItem('user_uuid', userData.uuid);
      encryptionService.setSessionItem('user_id', userData.user_id);
      
      // Store login history
      const loginHistory = {
        timestamp: new Date().toISOString(),
        user_id: userData.user_id,
        uuid: userData.uuid,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        last_ip: userData.last_ip || '192.168.31.76',
        last_device: userData.last_device || navigator.userAgent,
        created_at: userData.created_at,
        updated_at: userData.updated_at,
        login_from: 'Browser',
        login_time: new Date().toLocaleString(),
        success: true,
        message: responseData.message || 'Login successful'
      };
      
      encryptionService.setLoginHistory(loginHistory);
      
      // Store login time
      encryptionService.setSessionItem('login_time', new Date().toISOString());
      
      console.log('All data encrypted and stored in sessionStorage');
    } catch (error) {
      console.error('Error storing encrypted session data:', error);
    }
  }

  // Refresh Token
  async refreshToken() {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await authApi.post(API_CONFIG.endpoints.refresh, {
        refresh: refreshToken
      });

      if (response.data.access) {
        encryptionService.setToken('access_token', response.data.access);
        return {
          success: true,
          access: response.data.access
        };
      }

      return {
        success: false,
        message: 'Failed to refresh token'
      };
    } catch (error) {
      this.clearAll();
      return {
        success: false,
        message: 'Session expired. Please login again.'
      };
    }
  }

  // Logout
  async logout() {
    try {
      const accessToken = this.getAccessToken();
      if (accessToken) {
        await authApi.post(API_CONFIG.endpoints.logout, {}, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAll();
    }
  }

  // Token Management - Encrypted sessionStorage
  getAccessToken() {
    return encryptionService.getToken('access_token');
  }

  getRefreshToken() {
    return encryptionService.getToken('refresh_token');
  }

  // User Data - Encrypted sessionStorage
  getUserData() {
    return encryptionService.getUserData();
  }

  getUserRole() {
    return encryptionService.getSessionItem('user_role');
  }

  getUserName() {
    return encryptionService.getSessionItem('user_name') || 'User';
  }

  getUserEmail() {
    return encryptionService.getSessionItem('user_email');
  }

  getUserPhone() {
    return encryptionService.getSessionItem('user_phone');
  }

  getUserUUID() {
    return encryptionService.getSessionItem('user_uuid');
  }

  getUserId() {
    return encryptionService.getSessionItem('user_id');
  }

  getLoginHistory() {
    return encryptionService.getLoginHistory();
  }

  getLastLoginTime() {
    const history = this.getLoginHistory();
    return history?.login_time || 'Never';
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getAccessToken();
    if (!token) {
      console.log('No access token found');
      return false;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000;
      const isValid = Date.now() < expiry;
      console.log('Token valid:', isValid);
      return isValid;
    } catch (error) {
      console.error('Error checking token:', error);
      return false;
    }
  }

  // Check if user has required role
  hasRole(requiredRole) {
    const userRole = this.getUserRole();
    return userRole === requiredRole;
  }

  // Check if user is Vehicle Booking Controller Admin
  isVehicleAdmin() {
    return this.hasRole('Veichle_Booking_Controller_Admin');
  }

  // Get auth headers for API calls
  getAuthHeaders() {
    const token = this.getAccessToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  // Clear All Data - sessionStorage
  clearAll() {
    encryptionService.clearSession();
    console.log('All encrypted session data cleared');
  }

  // Handle API Errors
  handleError(error) {
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED' || error.message === 'Network Error') {
      return {
        success: false,
        message: 'Cannot connect to server. Please make sure the backend server is running.',
        code: 'NETWORK_ERROR'
      };
    }

    if (error.code === 'ERR_CONNECTION_CLOSED') {
      return {
        success: false,
        message: 'Connection to server was closed. Please try again.',
        code: 'CONNECTION_CLOSED'
      };
    }

    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return {
        success: false,
        message: 'Request timed out. Please check your connection.',
        code: 'TIMEOUT'
      };
    }

    if (error.response) {
      const { status, data } = error.response;
      
      console.log('API Error Response:', { status, data });
      
      switch (status) {
        case 400:
          let errorMsg = 'Validation error. ';
          if (data.message) {
            if (typeof data.message === 'string') {
              errorMsg = data.message;
            } else if (typeof data.message === 'object') {
              const keys = Object.keys(data.message);
              if (keys.length > 0) {
                const firstKey = keys[0];
                const value = data.message[firstKey];
                errorMsg = `${firstKey}: ${Array.isArray(value) ? value[0] : value}`;
              }
            }
          } else if (data.identifier) {
            errorMsg = `Identifier: ${Array.isArray(data.identifier) ? data.identifier[0] : data.identifier}`;
          } else if (data.password) {
            errorMsg = `Password: ${Array.isArray(data.password) ? data.password[0] : data.password}`;
          }
          return {
            success: false,
            message: errorMsg || 'Validation error. Please check your input.',
            errors: data.message || data
          };
        case 401:
          if (data.message === 'Account locked. Try later.') {
            return {
              success: false,
              message: data.message,
              code: 'ACCOUNT_LOCKED'
            };
          }
          return {
            success: false,
            message: data.message || 'Invalid credentials. Please check your identifier and password.',
            code: 'UNAUTHORIZED'
          };
        case 403:
          return {
            success: false,
            message: data.message || 'Access denied. You are not authorized.',
            code: 'FORBIDDEN'
          };
        case 404:
          return {
            success: false,
            message: `API endpoint not found. Please check the URL.`,
            code: 'NOT_FOUND'
          };
        case 429:
          return {
            success: false,
            message: 'Too many attempts. Please try again later.',
            code: 'RATE_LIMIT'
          };
        case 500:
          return {
            success: false,
            message: data.message || 'Server error. Please try again later.',
            code: 'SERVER_ERROR'
          };
        default:
          return {
            success: false,
            message: data.message || `Error ${status}: ${error.message}`,
            code: 'UNKNOWN'
          };
      }
    } else if (error.request) {
      return {
        success: false,
        message: 'No response from server. Please check your connection.',
        code: 'NO_RESPONSE'
      };
    } else {
      return {
        success: false,
        message: `Error: ${error.message}`,
        code: 'UNKNOWN_ERROR'
      };
    }
  }

  // API call with token (manual)
  async apiCall(method, endpoint, data = null) {
    try {
      const token = this.getAccessToken();
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const config = {
        method,
        url: endpoint,
        headers,
        data: data || undefined
      };

      const response = await authApi(config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Protected API calls
  async getProfile() {
    return this.apiCall('get', API_CONFIG.endpoints.profile);
  }

  async updateProfile(data) {
    return this.apiCall('put', API_CONFIG.endpoints.profile, data);
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService;
export { authApi };