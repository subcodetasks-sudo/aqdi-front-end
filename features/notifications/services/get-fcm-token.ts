import { getToken } from "firebase/messaging";

import {
  getFirebaseVapidKey,
  isFirebaseConfigured,
} from "@/features/notifications/services/firebase-config";
import { getFirebaseMessagingAsync } from "@/features/notifications/services/firebase-client";

const SERVICE_WORKER_URL = "/firebase-messaging-sw.js";
const SERVICE_WORKER_SCOPE = "/";

async function ensureServiceWorkerRegistration() {
  if (!("serviceWorker" in navigator)) {
    return null;
  }

  try {
    let registration =
      await navigator.serviceWorker.getRegistration(SERVICE_WORKER_SCOPE);

    if (!registration) {
      registration = await navigator.serviceWorker.register(SERVICE_WORKER_URL, {
        scope: SERVICE_WORKER_SCOPE,
      });
    }

    await navigator.serviceWorker.ready;
    return registration;
  } catch (error) {
    console.warn("Service worker registration failed:", error);
    return null;
  }
}

export async function registerFirebaseServiceWorker() {
  return ensureServiceWorkerRegistration();
}

export async function getFcmToken(options?: { requestPermission?: boolean }) {
  if (typeof window === "undefined") {
    return null;
  }

  if (!isFirebaseConfigured()) {
    console.warn("FCM: Firebase env vars are missing.");
    return null;
  }

  const vapidKey = getFirebaseVapidKey();
  if (!vapidKey) {
    console.warn("FCM: NEXT_PUBLIC_FIREBASE_VAPID_KEY is missing.");
    return null;
  }

  if (!("Notification" in window)) {
    console.warn("FCM: Notifications are not supported in this browser.");
    return null;
  }

  if (!window.isSecureContext) {
    console.warn("FCM: Requires HTTPS or localhost.");
    return null;
  }

  try {
    let permission = Notification.permission;

    if (permission === "default" && options?.requestPermission) {
      permission = await Notification.requestPermission();
    }

    if (permission !== "granted") {
      console.warn("FCM: Notification permission was not granted.");
      return null;
    }

    const messagingInstance = await getFirebaseMessagingAsync();
    if (!messagingInstance) {
      console.warn("FCM: Messaging is not supported in this browser.");
      return null;
    }

    const registration = await ensureServiceWorkerRegistration();
    if (!registration) {
      return null;
    }

    const token = await getToken(messagingInstance, {
      vapidKey,
      serviceWorkerRegistration: registration,
    });

    return token || null;
  } catch (error) {
    console.warn("Failed to get FCM token:", error);
    return null;
  }
}
