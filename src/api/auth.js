import axios from 'axios';
import API_CONFIG from './config';
import encryptionService from '../utils/encryption';
import { requestFCMToken, isFCMAvailable } from '../firebase/firebase';

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
    // Singleton instance check
    if (AuthService._instance) {
      return AuthService._instance;
    }
    AuthService._instance = this;

    // Verification cache with deduplication
    this._verificationCache = {
      timestamp: null,
      result: null,
      token: null,
      pending: false,
      pendingPromise: null,
      inProgress: false
    };
    
    this._cacheDuration = 30000;
    this._lastVerifyTime = 0;
    this._isVerifying = false;
    this._verifyPromise = null;
    
  }

  /**
   * ============================================
   * SINGLETON INSTANCE
   * ============================================
   */
  static getInstance() {
    if (!AuthService._instance) {
      AuthService._instance = new AuthService();
    }
    return AuthService._instance;
  }

  /**
   * ============================================
   * LOGIN METHOD
   * ============================================
   */

  async login(identifier, password) {
    try {
      console.log('Attempting login with:', { identifier, password: '***' });
      
      let fcmToken = null;
      const enableFCM = import.meta.env.VITE_ENABLE_FCM !== 'false';
      
      if (enableFCM) {
        try {
          fcmToken = await this.getFCMToken();
        } catch (error) {
          console.log('ℹ️ FCM token not available, continuing without it');
        }
      }
      
      const payload = { 
        identifier: identifier,
        password: password 
      };
      
      if (fcmToken) {
        payload.fcm_token = fcmToken;
        console.log('📱 FCM token added to login payload');
      }
      
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
            this.storeEncryptedSessionData(tokens, userData, data);
            
            // Clear verification cache on new login
            this.clearVerificationCache();
            
            if (fcmToken) {
              localStorage.setItem('fcm_token', fcmToken);
              console.log('✅ FCM token stored locally');
            }
            
            console.log('✅ Login successful!');
            
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

  /**
   * ============================================
   * TOKEN VERIFICATION - WITH DEDUPLICATION
   * ============================================
   */

  async verifyToken(token) {
    // If no token, return early
    if (!token) {
      return { success: false, message: 'No token provided' };
    }

    // If verification is already in progress, return the existing promise
    if (this._isVerifying) {
      return this._verifyPromise;
    }

    // Check cache first
    const cachedResult = this._getCachedResult(token);
    if (cachedResult) {
      return cachedResult;
    }

    // Start verification
    this._isVerifying = true;
    this._verifyPromise = this._performVerificationWithLock(token);
    
    try {
      const result = await this._verifyPromise;
      return result;
    } finally {
      this._isVerifying = false;
      this._verifyPromise = null;
    }
  }

  /**
   * Get cached result if valid
   */
  _getCachedResult(token) {
    const now = Date.now();
    const cached = this._verificationCache;
    
    if (
      cached.token === token &&
      cached.result &&
      cached.timestamp &&
      (now - cached.timestamp) < this._cacheDuration
    ) {
      return cached.result;
    }

    // Rate limiting
    if (cached.result && (now - this._lastVerifyTime) < 1000) {
      console.log('⏱️ Rate limiting - using cached result');
      return cached.result;
    }

    return null;
  }

  /**
   * Perform verification with lock
   */
  async _performVerificationWithLock(token) {
    try {
      // Double-check cache after acquiring lock
      const cachedResult = this._getCachedResult(token);
      if (cachedResult) {
        return cachedResult;
      }

      
      const response = await authApi.post(API_CONFIG.endpoints.verify, {
        token: token
      });


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
        timestamp: Date.now(),
        result: result,
        token: token,
        pending: false,
        pendingPromise: null,
        inProgress: false
      };
      
      this._lastVerifyTime = Date.now();

      return result;
      
    } catch (error) {
      console.error('❌ Verification API error:', error);
      const result = {
        success: false,
        message: error.response?.data?.message || error.message || 'Verification failed'
      };
      
      // Cache error result for shorter time (5 seconds)
      this._verificationCache = {
        timestamp: Date.now(),
        result: result,
        token: token,
        pending: false,
        pendingPromise: null,
        inProgress: false
      };
      
      return result;
    }
  }

  /**
   * Verify current session - with deduplication
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
      pendingPromise: null,
      inProgress: false
    };
    this._lastVerifyTime = 0;
    this._isVerifying = false;
    this._verifyPromise = null;
  }

  /**
   * ============================================
   * FCM TOKEN MANAGEMENT
   * ============================================
   */

  async getFCMToken() {
    try {
      const enableFCM = import.meta.env.VITE_ENABLE_FCM !== 'false';
      if (!enableFCM) {
        console.log('ℹ️ FCM is disabled in environment');
        return null;
      }

      let fcmToken = localStorage.getItem('fcm_token');
      
      if (fcmToken) {
        console.log('📱 Using existing FCM token from localStorage');
        return fcmToken;
      }

      if (!isFCMAvailable()) {
        console.warn('⚠️ FCM not available, skipping token request');
        return null;
      }

      console.log('📱 Requesting new FCM token...');
      fcmToken = await requestFCMToken();
      
      if (fcmToken) {
        localStorage.setItem('fcm_token', fcmToken);
        console.log('✅ FCM token stored locally');
        return fcmToken;
      } else {
        console.log('ℹ️ Failed to get FCM token');
        return null;
      }
      
    } catch (error) {
      console.error('❌ Error getting FCM token:', error);
      return null;
    }
  }

  clearFCMToken() {
    localStorage.removeItem('fcm_token');
  }

  /**
   * ============================================
   * TOKEN REFRESH
   * ============================================
   */

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
          encryptionService.setToken('access_token', tokens.access);
          encryptionService.setToken('refresh_token', tokens.refresh);
          
          this.clearVerificationCache();
          
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

  /**
   * ============================================
   * LOGOUT METHODS
   * ============================================
   */

  async logout() {
    try {
      
      const accessToken = this.getAccessToken();
      const refreshToken = this.getRefreshToken();
      
      if (accessToken && refreshToken) {
        try {
          await authApi.post(
            API_CONFIG.endpoints.logout,
            { refresh: refreshToken },
            {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              }
            }
          );
        } catch (apiError) {
        }
      }
      
      await this.clearAllData();
      
      return { success: true, message: 'Logged out successfully' };
      
    } catch (error) {
      console.error('❌ Logout error:', error);
      await this.clearAllData();
      return {
        success: false,
        message: error.response?.data?.message || 'Logout failed'
      };
    }
  }

  async logoutAllDevices() {
    try {
      
      const accessToken = this.getAccessToken();
      const refreshToken = this.getRefreshToken();
      
      let blacklistedTokens = 0;
      
      if (accessToken && refreshToken) {
        try {
          const response = await authApi.post(
            API_CONFIG.endpoints.logoutAllDevices,
            { refresh: refreshToken },
            {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              }
            }
          );
          blacklistedTokens = response.data?.blacklisted_tokens || 0;
        } catch (apiError) {
        }
      }
      
      await this.clearAllData();
      
      return {
        success: true,
        message: 'Logged out from all devices successfully',
        blacklistedTokens: blacklistedTokens
      };
      
    } catch (error) {
      console.error('❌ Logout-all error:', error);
      await this.clearAllData();
      return {
        success: false,
        message: error.response?.data?.message || 'Logout from all devices failed',
        blacklistedTokens: 0
      };
    }
  }

  async clearAllData() {
    try {
      this.clearFCMToken();
      this.clearAll();
      this.clearVerificationCache();
      sessionStorage.clear();
    } catch (error) {
      console.error('❌ Error clearing data:', error);
    }
  }

  /**
   * ============================================
   * TOKEN STORAGE METHODS
   * ============================================
   */

  storeEncryptedSessionData(tokens, userData, responseData) {
    try {
      if (tokens.access) {
        encryptionService.setToken('access_token', tokens.access);
      }
      if (tokens.refresh) {
        encryptionService.setToken('refresh_token', tokens.refresh);
      }
      
      this.setUserData(userData);
      
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
      encryptionService.setSessionItem('login_time', new Date().toISOString());
      
      console.log('All data encrypted and stored in sessionStorage');
    } catch (error) {
      console.error('Error storing encrypted session data:', error);
    }
  }

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
      
      if (userData.role) encryptionService.setSessionItem('user_role', userData.role);
      if (userData.name) encryptionService.setSessionItem('user_name', userData.name);
      if (userData.email) encryptionService.setSessionItem('user_email', userData.email);
      if (userData.phone) encryptionService.setSessionItem('user_phone', userData.phone);
      if (userData.uuid) encryptionService.setSessionItem('user_uuid', userData.uuid);
      if (userData.user_id) encryptionService.setSessionItem('user_id', userData.user_id);
    }
  }

  /**
   * ============================================
   * TOKEN GETTER METHODS
   * ============================================
   */

  getAccessToken() {
    return encryptionService.getToken('access_token');
  }

  getRefreshToken() {
    return encryptionService.getToken('refresh_token');
  }

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

  hasRole(requiredRole) {
    const userRole = this.getUserRole();
    console.log('User role:', userRole, 'Required:', requiredRole);
    return userRole === requiredRole;
  }

  isVehicleAdmin() {
    return this.hasRole('Veichle_Booking_Controller_Admin');
  }

  clearAll() {
    encryptionService.clearSession();
    this.clearVerificationCache();
    console.log('All encrypted session data cleared');
  }

  getAuthHeaders() {
    const token = this.getAccessToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

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

  async getProfile() {
    return this.apiCall('get', API_CONFIG.endpoints.profile);
  }

  async updateProfile(data) {
    return this.apiCall('put', API_CONFIG.endpoints.profile, data);
  }

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
          } else if (data.detail) {
            errorMsg = data.detail;
          }
          return {
            success: false,
            message: errorMsg || 'Validation error. Please check your input.',
            errors: data.message || data,
            details: data
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
              code: 'TOKEN_EXPIRED',
              details: data
            };
          }
          return {
            success: false,
            message: data.message || data.detail || 'Invalid credentials. Please check your identifier and password.',
            code: 'UNAUTHORIZED',
            details: data
          };
        case 403:
          return {
            success: false,
            message: data.message || data.detail || 'Access denied. You are not authorized.',
            code: 'FORBIDDEN',
            details: data
          };
        case 404:
          return {
            success: false,
            message: data.detail || 'API endpoint not found. Please check the URL.',
            code: 'NOT_FOUND',
            details: data
          };
        case 429:
          return {
            success: false,
            message: 'Too many attempts. Please try again later.',
            code: 'RATE_LIMIT',
            details: data
          };
        case 500:
          return {
            success: false,
            message: data.message || data.detail || 'Server error. Please try again later.',
            code: 'SERVER_ERROR',
            details: data
          };
        default:
          return {
            success: false,
            message: data.message || data.detail || `Error ${status}: ${error.message}`,
            code: 'UNKNOWN',
            details: data
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
}

// Export singleton instance
const authService = AuthService.getInstance();

export default authService;
export { authApi };