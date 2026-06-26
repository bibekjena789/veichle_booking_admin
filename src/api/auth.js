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

class AuthService {
  constructor() {
    // Verification cache
    this._verificationCache = {
      timestamp: null,
      result: null,
      token: null,
      pending: false,
      pendingPromise: null
    };
    
    // Cache duration in milliseconds (30 seconds)
    this._cacheDuration = 30000;
    
    // Debounce timer
    this._debounceTimer = null;
    this._lastVerifyTime = 0;
  }

  /**
   * Verify Token with deduplication - prevents multiple simultaneous calls
   */
  async verifyToken(token) {
    try {
      // If no token, return early
      if (!token) {
        return { success: false, message: 'No token provided' };
      }

      // Check if there's already a pending verification for this token
      if (this._verificationCache.pending && 
          this._verificationCache.token === token) {
        console.log('⏳ Waiting for pending verification...');
        return this._verificationCache.pendingPromise;
      }

      // Check cache for recent result
      const now = Date.now();
      const cachedToken = this._verificationCache.token;
      const cachedTimestamp = this._verificationCache.timestamp;
      const cachedResult = this._verificationCache.result;
      
      // If same token and cache is still fresh, return cached result
      if (
        cachedToken === token && 
        cachedResult && 
        cachedTimestamp && 
        (now - cachedTimestamp) < this._cacheDuration
      ) {
        console.log('📦 Using cached token verification result');
        return cachedResult;
      }

      // Rate limiting - prevent too many calls
      if (now - this._lastVerifyTime < 1000) {
        console.log('⏱️ Rate limiting verification, using cached if available');
        if (cachedResult) {
          return cachedResult;
        }
      }

      console.log('🔄 Making fresh token verification API call');

      // Create a pending promise
      this._verificationCache.pending = true;
      this._verificationCache.token = token;
      this._verificationCache.pendingPromise = this._performVerification(token);
      
      const result = await this._verificationCache.pendingPromise;
      
      // Clear pending state
      this._verificationCache.pending = false;
      this._verificationCache.pendingPromise = null;
      
      return result;
      
    } catch (error) {
      console.error('❌ Token verify error:', error);
      this._verificationCache.pending = false;
      this._verificationCache.pendingPromise = null;
      return {
        success: false,
        message: error.message || 'Token verification failed'
      };
    }
  }

  /**
   * Perform actual verification (internal method)
   */
  async _performVerification(token) {
    try {
      const response = await authApi.post(API_CONFIG.endpoints.verify, {
        token: token
      });

      console.log('📡 Token verify response received');

      let result;
      if (response.status === 200 && response.data.status === true) {
        result = {
          success: true,
          data: response.data.data,
          message: response.data.message || 'Token is valid'
        };
      } else {
        result = {
          success: false,
          message: response.data.message || 'Invalid token'
        };
      }

      // Update cache
      this._verificationCache = {
        ...this._verificationCache,
        timestamp: Date.now(),
        result: result,
        token: token
      };
      
      this._lastVerifyTime = Date.now();

      return result;
    } catch (error) {
      console.error('❌ Verification API error:', error);
      const result = {
        success: false,
        message: error.response?.data?.message || error.message || 'Verification failed'
      };
      
      // Cache error result for a shorter time (5 seconds)
      this._verificationCache = {
        ...this._verificationCache,
        timestamp: Date.now(),
        result: result,
        token: token
      };
      
      return result;
    }
  }

  /**
   * Verify current session with deduplication
   */
  async verifyCurrentSession() {
    const token = this.getAccessToken();
    if (!token) {
      return { success: false, message: 'No token found' };
    }
    return this.verifyToken(token);
  }

  /**
   * Clear verification cache
   */
  clearVerificationCache() {
    this._verificationCache = {
      timestamp: null,
      result: null,
      token: null,
      pending: false,
      pendingPromise: null
    };
    this._lastVerifyTime = 0;
    console.log('🧹 Verification cache cleared');
  }

  // ... rest of the methods remain the same ...
  
  // Login method
  async login(identifier, password) {
    try {
      console.log('Attempting login with:', { identifier, password: '***' });
      
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
          
          if (tokens.access && tokens.access !== 'undefined' && tokens.access !== 'null') {
            // Store encrypted data in sessionStorage
            this.storeEncryptedSessionData(tokens, userData, data);
            
            // Clear verification cache on new login
            this.clearVerificationCache();
            
            console.log('Login successful!');
            
            return {
              success: true,
              data: userData,
              tokens: tokens,
              message: data.message || 'Login successful'
            };
          } else {
            console.error('Invalid access token:', tokens.access);
            return {
              success: false,
              message: 'Invalid token received from server.'
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

  // Refresh Token - clears cache on refresh
  async refreshToken() {
    try {
      const refreshToken = this.getRefreshToken();
      
      if (!refreshToken) {
        console.log('No refresh token available');
        this.clearAll();
        return {
          success: false,
          message: 'No refresh token available'
        };
      }

      console.log('Attempting to refresh token...');
      
      const response = await authApi.post(API_CONFIG.endpoints.refresh, {
        refresh: refreshToken
      });

      console.log('Token refresh response:', response.data);

      if (response.status === 200 && response.data.status === true) {
        const tokens = {
          access: response.data.tokens?.access,
          refresh: response.data.tokens?.refresh
        };

        if (tokens.access && tokens.refresh) {
          // Store new tokens
          encryptionService.setToken('access_token', tokens.access);
          encryptionService.setToken('refresh_token', tokens.refresh);
          
          // Clear verification cache on token refresh
          this.clearVerificationCache();
          
          // Update user data if provided
          if (response.data.data) {
            this.setUserData(response.data.data);
          }

          console.log('Token refreshed successfully');
          
          return {
            success: true,
            access: tokens.access,
            refresh: tokens.refresh,
            data: response.data.data,
            message: response.data.message || 'Token refreshed successfully'
          };
        }
      }

      return {
        success: false,
        message: response.data.message || 'Failed to refresh token'
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      this.clearAll();
      this.clearVerificationCache();
      return {
        success: false,
        message: 'Session expired. Please login again.'
      };
    }
  }

  // Logout - clears cache
  async logout() {
    try {
      const accessToken = this.getAccessToken();
      const refreshToken = this.getRefreshToken();
      
      if (!accessToken || !refreshToken) {
        console.log('No tokens found, clearing session');
        this.clearAll();
        this.clearVerificationCache();
        return { success: true, message: 'Logged out' };
      }

      const response = await authApi.post(
        API_CONFIG.endpoints.logout,
        { refresh: refreshToken },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Logout response:', response.data);
      
      // Clear session and cache
      this.clearAll();
      this.clearVerificationCache();
      
      return {
        success: true,
        message: response.data?.message || 'Logged out successfully'
      };
      
    } catch (error) {
      console.error('Logout error:', error);
      this.clearAll();
      this.clearVerificationCache();
      return {
        success: false,
        message: error.response?.data?.message || 'Logout failed'
      };
    }
  }

  // Store encrypted session data
  storeEncryptedSessionData(tokens, userData, responseData) {
    try {
      // Store tokens encrypted
      if (tokens.access) {
        encryptionService.setToken('access_token', tokens.access);
      }
      if (tokens.refresh) {
        encryptionService.setToken('refresh_token', tokens.refresh);
      }
      
      // Store user data encrypted
      this.setUserData(userData);
      
      // Store login history
      const loginHistory = {
        timestamp: new Date().toISOString(),
        user_id: userData?.user_id || null,
        uuid: userData?.uuid || null,
        name: userData?.name || 'User',
        email: userData?.email || null,
        phone: userData?.phone || null,
        role: userData?.role || null,
        last_ip: userData?.last_ip || '192.168.31.76',
        last_device: userData?.last_device || navigator.userAgent,
        created_at: userData?.created_at || null,
        updated_at: userData?.updated_at || null,
        login_from: 'Browser',
        login_time: new Date().toLocaleString(),
        success: true,
        message: responseData?.message || 'Login successful'
      };
      
      encryptionService.setLoginHistory(loginHistory);
      
      // Store login time
      encryptionService.setSessionItem('login_time', new Date().toISOString());
      
      console.log('All data encrypted and stored in sessionStorage');
    } catch (error) {
      console.error('Error storing encrypted session data:', error);
    }
  }

  // Set user data
  setUserData(userData) {
    if (userData && typeof userData === 'object') {
      const userDataToStore = {
        user_id: userData.user_id || null,
        uuid: userData.uuid || null,
        name: userData.name || 'User',
        email: userData.email || null,
        phone: userData.phone || null,
        role: userData.role || null,
        is_active: userData.is_active || false,
        is_staff: userData.is_staff || false,
        is_superuser: userData.is_superuser || false,
        last_ip: userData.last_ip || null,
        last_device: userData.last_device || navigator.userAgent,
        created_at: userData.created_at || null,
        updated_at: userData.updated_at || null
      };
      
      encryptionService.setUserData(userDataToStore);
      
      // Store individual user fields for easy access
      if (userData.role) encryptionService.setSessionItem('user_role', userData.role);
      if (userData.name) encryptionService.setSessionItem('user_name', userData.name);
      if (userData.email) encryptionService.setSessionItem('user_email', userData.email);
      if (userData.phone) encryptionService.setSessionItem('user_phone', userData.phone);
      if (userData.uuid) encryptionService.setSessionItem('user_uuid', userData.uuid);
      if (userData.user_id) encryptionService.setSessionItem('user_id', userData.user_id);
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

  // Check if user is authenticated (local check)
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
      
      if (!isValid) {
        this.clearVerificationCache();
      }
      
      return isValid;
    } catch (error) {
      console.error('Error checking token:', error);
      return false;
    }
  }

  // Check if user has required role
  hasRole(requiredRole) {
    const userRole = this.getUserRole();
    console.log('User role:', userRole, 'Required:', requiredRole);
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
    this.clearVerificationCache();
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
          } else if (data.token) {
            errorMsg = `Token: ${Array.isArray(data.token) ? data.token[0] : data.token}`;
          } else if (data.refresh) {
            errorMsg = `Refresh: ${Array.isArray(data.refresh) ? data.refresh[0] : data.refresh}`;
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
          if (data.message === 'Invalid or expired access token.' || 
              data.message === 'Refresh token is invalid, expired, or blacklisted.') {
            return {
              success: false,
              message: data.message,
              code: 'TOKEN_EXPIRED'
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