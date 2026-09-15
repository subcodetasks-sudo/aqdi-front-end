/* global self, importScripts, firebase */
// Keep in sync with NEXT_PUBLIC_FIREBASE_* env vars.

importScripts("https://www.gstatic.com/firebasejs/12.11.0/firebase-app-compat.js");
importScripts(
  "https://www.gstatic.com/firebasejs/12.11.0/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyBGg6G-3NZb6-M-6gcjsLEY6IjIN3ixJII",
  authDomain: "aqdi-3d3ee.firebaseapp.com",
  projectId: "aqdi-3d3ee",
  storageBucket: "aqdi-3d3ee.firebasestorage.app",
  messagingSenderId: "834427823859",
  appId: "1:834427823859:web:9ad86ee9158753eac5f986",
  measurementId: "G-73D838TV0M",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle =
    payload.data?.title || payload.notification?.title || "New Message";
  const notificationOptions = {
    body:
      payload.data?.body ||
      payload.notification?.body ||
      "Check your notifications.",
    icon: payload.data?.icon || "/firebase-logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
