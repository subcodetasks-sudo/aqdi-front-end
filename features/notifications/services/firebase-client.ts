import {
  getMessaging,
  isSupported,
  onMessage,
  type Messaging,
  type MessagePayload,
} from "firebase/messaging";
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported as isAnalyticsSupported, type Analytics } from "firebase/analytics";

import {
  getFirebaseClientConfig,
  isFirebaseConfigured,
} from "@/features/notifications/services/firebase-config";

let app: FirebaseApp | null = null;
let analytics: Analytics | null = null;
let messaging: Messaging | null = null;
let messagingSupport: boolean | null = null;

function getFirebaseApp() {
  if (!isFirebaseConfigured()) {
    return null;
  }

  if (!app) {
    app =
      getApps().length === 0 ? initializeApp(getFirebaseClientConfig()) : getApp();
  }

  return app;
}

export async function initFirebaseAnalytics() {
  if (typeof window === "undefined" || analytics) {
    return analytics;
  }

  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) {
    return null;
  }

  const supported = await isAnalyticsSupported();
  if (!supported) {
    return null;
  }

  analytics = getAnalytics(firebaseApp);
  return analytics;
}

async function isMessagingSupported() {
  if (typeof window === "undefined") {
    return false;
  }

  if (messagingSupport === null) {
    messagingSupport = await isSupported();
  }

  return messagingSupport;
}

export async function getFirebaseMessagingAsync(): Promise<Messaging | null> {
  if (typeof window === "undefined" || messaging) {
    return messaging;
  }

  const supported = await isMessagingSupported();
  if (!supported) {
    return null;
  }

  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) {
    return null;
  }

  messaging = getMessaging(firebaseApp);
  return messaging;
}

export const getFirebaseMessaging = (): Messaging | null => messaging;

export const onForegroundMessage = (
  callback: (payload: MessagePayload) => void,
) => {
  const messagingInstance = getFirebaseMessaging();
  if (messagingInstance) {
    return onMessage(messagingInstance, (payload: MessagePayload) => {
      callback(payload);
    });
  }

  return () => {};
};
