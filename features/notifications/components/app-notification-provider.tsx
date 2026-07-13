"use client";

import { useEffect } from "react";
import type { MessagePayload } from "firebase/messaging";

import AppNotificationToaster from "@/features/notifications/components/app-notification-toaster";
import {
  getFirebaseMessagingAsync,
  initFirebaseAnalytics,
  onForegroundMessage,
} from "@/features/notifications/services/firebase-client";
import { registerFirebaseServiceWorker } from "@/features/notifications/services/get-fcm-token";
import { showAppNotification } from "@/features/notifications/services/show-app-notification";

function parseForegroundMessage(payload: MessagePayload) {
  return {
    title:
      payload.notification?.title ||
      payload.data?.title ||
      "إشعار جديد",
    body:
      payload.notification?.body ||
      payload.data?.body ||
      "",
    icon: payload.notification?.icon || payload.data?.icon,
  };
}

export function AppNotificationProvider() {
  useEffect(() => {
    void initFirebaseAnalytics();
    void registerFirebaseServiceWorker();

    let unsubscribe = () => {};

    void getFirebaseMessagingAsync().then((messaging) => {
      if (!messaging) {
        return;
      }

      unsubscribe = onForegroundMessage((payload) => {
        const notification = parseForegroundMessage(payload);
        showAppNotification(notification);
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return <AppNotificationToaster />;
}
