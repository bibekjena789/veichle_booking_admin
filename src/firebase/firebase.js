import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// VAPID Key from Firebase Console
const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

// Initialize Firebase
let app = null;
let messaging = null;
let analytics = null;

try {
  // Validate config
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
  const missingFields = requiredFields.filter(field => !firebaseConfig[field]);
  
  if (missingFields.length > 0) {
  } else {
    app = initializeApp(firebaseConfig);
    
    if (typeof window !== 'undefined') {
      analytics = getAnalytics(app);
    }
    
    if ('serviceWorker' in navigator) {
      messaging = getMessaging(app);
    } else {
      console.warn('⚠️ Service Worker not available');
    }
    
  }
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
}

/**
 * Request permission and get FCM token
 */
export const requestFCMToken = async () => {
  try {
    if (!messaging) {
      console.warn('⚠️ Firebase messaging not initialized');
      return null;
    }

    if (!('Notification' in window)) {
      console.warn('⚠️ Notification API not supported');
      return null;
    }

    // Check current permission status
    let permission = Notification.permission;
    
    if (permission === 'default') {
      permission = await Notification.requestPermission();
    }
    
    console.log('📱 Notification permission:', permission);
    
    if (permission === 'granted') {
      
      if (!VAPID_KEY || VAPID_KEY === 'YOUR_ACTUAL_VAPID_KEY_FROM_FIREBASE') {
        console.error('❌ VAPID key is missing or not configured');
        console.error('📌 Get it from: Firebase Console > Project Settings > Cloud Messaging > Web configuration');
        return null;
      }
      
      console.log('🔑 Using VAPID key (first 10 chars):', VAPID_KEY.substring(0, 10) + '...');
      
      try {
        const token = await getToken(messaging, {
          vapidKey: VAPID_KEY,
        });
        
        if (token) {
          return token;
        } else {
          console.log('❌ No FCM token received');
          return null;
        }
      } catch (tokenError) {
        console.error('❌ Error getting FCM token:', tokenError);
        
        if (tokenError.message && tokenError.message.includes('applicationServerKey')) {
          console.error('❌ Invalid VAPID key.');
          console.error('📌 Please get the correct key from:');
          console.error('   Firebase Console > Project Settings > Cloud Messaging > Web configuration');
        }
        return null;
      }
    } else {
      console.log('❌ Notification permission denied');
      return null;
    }
  } catch (error) {
    console.error('❌ Error requesting FCM token:', error);
    return null;
  }
};

/**
 * Listen for incoming messages while app is in foreground
 */
export const onMessageListener = () => {
  return new Promise((resolve) => {
    if (messaging) {
      onMessage(messaging, (payload) => {
        console.log('📨 Message received while app is in foreground:', payload);
        resolve(payload);
      });
    } else {
      console.warn('⚠️ Firebase messaging not initialized');
      resolve(null);
    }
  });
};

/**
 * Check if FCM is available
 */
export const isFCMAvailable = () => {
  return !!messaging && !!navigator.serviceWorker;
};

/**
 * Get FCM status
 */
export const getFCMStatus = () => {
  const status = {
    initialized: !!messaging,
    notificationPermission: 'Notification' in window ? Notification.permission : 'not-available',
    serviceWorkerAvailable: 'serviceWorker' in navigator,
    projectId: firebaseConfig.projectId,
    vapidKeyConfigured: VAPID_KEY && VAPID_KEY !== 'YOUR_ACTUAL_VAPID_KEY_FROM_FIREBASE',
    messagingSenderId: firebaseConfig.messagingSenderId,
  };
  
  return status;
};

export default messaging;