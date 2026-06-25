import CryptoJS from 'crypto-js';

// Secret key - In production, this should come from environment variables
const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'PixiYatraSecretKey2024!@#$';

class EncryptionService {
  // Encrypt data
  encrypt(data) {
    try {
      if (typeof data === 'object') {
        data = JSON.stringify(data);
      }
      const encrypted = CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
      return encrypted;
    } catch (error) {
      console.error('Encryption error:', error);
      return null;
    }
  }

  // Decrypt data
  decrypt(encryptedData) {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
      const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
      
      // Try to parse as JSON
      try {
        return JSON.parse(decryptedString);
      } catch {
        return decryptedString;
      }
    } catch (error) {
      console.error('Decryption error:', error);
      return null;
    }
  }

  // Encrypt and store in sessionStorage
  setSessionItem(key, data) {
    try {
      const encrypted = this.encrypt(data);
      if (encrypted) {
        sessionStorage.setItem(key, encrypted);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error storing encrypted session item:', error);
      return false;
    }
  }

  // Get and decrypt from sessionStorage
  getSessionItem(key) {
    try {
      const encrypted = sessionStorage.getItem(key);
      if (!encrypted) return null;
      return this.decrypt(encrypted);
    } catch (error) {
      console.error('Error retrieving encrypted session item:', error);
      return null;
    }
  }

  // Remove item from sessionStorage
  removeSessionItem(key) {
    sessionStorage.removeItem(key);
  }

  // Clear all sessionStorage
  clearSession() {
    sessionStorage.clear();
  }

  // Store token with encryption
  setToken(key, token) {
    return this.setSessionItem(key, token);
  }

  // Get token with decryption
  getToken(key) {
    return this.getSessionItem(key);
  }

  // Store user data with encryption
  setUserData(userData) {
    return this.setSessionItem('user_data', userData);
  }

  // Get user data with decryption
  getUserData() {
    return this.getSessionItem('user_data');
  }

  // Store login history
  setLoginHistory(history) {
    return this.setSessionItem('login_history', history);
  }

  // Get login history
  getLoginHistory() {
    return this.getSessionItem('login_history');
  }

  // Store multiple items
  setMultipleItems(items) {
    try {
      for (const [key, value] of Object.entries(items)) {
        this.setSessionItem(key, value);
      }
      return true;
    } catch (error) {
      console.error('Error storing multiple items:', error);
      return false;
    }
  }

  // Get multiple items
  getMultipleItems(keys) {
    try {
      const result = {};
      for (const key of keys) {
        result[key] = this.getSessionItem(key);
      }
      return result;
    } catch (error) {
      console.error('Error retrieving multiple items:', error);
      return null;
    }
  }
}

// Create singleton instance
const encryptionService = new EncryptionService();

export default encryptionService;