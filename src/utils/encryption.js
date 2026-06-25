import CryptoJS from 'crypto-js';

// Secret key - In production, this should come from environment variables
const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'PixiYatraSecretKey2024!@#$';

class EncryptionService {
  // Encrypt data
  encrypt(data) {
    try {
      // Handle null or undefined
      if (data === null || data === undefined) {
        return null;
      }
      
      // Convert to string if it's an object
      let stringData = data;
      if (typeof data === 'object') {
        stringData = JSON.stringify(data);
      }
      
      // If it's not a string, convert to string
      if (typeof stringData !== 'string') {
        stringData = String(stringData);
      }
      
      // Encrypt the string
      const encrypted = CryptoJS.AES.encrypt(stringData, SECRET_KEY).toString();
      return encrypted;
    } catch (error) {
      console.error('Encryption error:', error);
      return null;
    }
  }

  // Decrypt data
  decrypt(encryptedData) {
    try {
      if (!encryptedData) {
        return null;
      }
      
      const decrypted = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
      const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
      
      if (!decryptedString) {
        return null;
      }
      
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
      // Skip if data is null or undefined
      if (data === null || data === undefined) {
        sessionStorage.removeItem(key);
        return false;
      }
      
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
    if (!token) {
      sessionStorage.removeItem(key);
      return false;
    }
    return this.setSessionItem(key, token);
  }

  // Get token with decryption
  getToken(key) {
    return this.getSessionItem(key);
  }

  // Store user data with encryption
  setUserData(userData) {
    if (!userData || typeof userData !== 'object') {
      return false;
    }
    return this.setSessionItem('user_data', userData);
  }

  // Get user data with decryption
  getUserData() {
    return this.getSessionItem('user_data');
  }

  // Store login history
  setLoginHistory(history) {
    if (!history || typeof history !== 'object') {
      return false;
    }
    return this.setSessionItem('login_history', history);
  }

  // Get login history
  getLoginHistory() {
    return this.getSessionItem('login_history');
  }

  // Store multiple items
  setMultipleItems(items) {
    try {
      if (!items || typeof items !== 'object') {
        return false;
      }
      
      let success = true;
      for (const [key, value] of Object.entries(items)) {
        const result = this.setSessionItem(key, value);
        if (!result) success = false;
      }
      return success;
    } catch (error) {
      console.error('Error storing multiple items:', error);
      return false;
    }
  }

  // Get multiple items
  getMultipleItems(keys) {
    try {
      if (!keys || !Array.isArray(keys)) {
        return null;
      }
      
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