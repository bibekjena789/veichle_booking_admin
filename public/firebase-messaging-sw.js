// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDe-DZuxBHsRUuuwSqTGz6ZCgZRerPbDBM",
  authDomain: "pixiyatra.firebaseapp.com",
  projectId: "pixiyatra",
  storageBucket: "pixiyatra.firebasestorage.app",
  messagingSenderId: "321730432340",
  appId: "1:321730432340:web:c111bf17594936393accc1",
  measurementId: "G-P06R7NRXKZ"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png',
    data: payload.data,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});