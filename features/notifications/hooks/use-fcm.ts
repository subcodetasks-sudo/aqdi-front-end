"use client";

import { useCallback, useEffect, useState } from "react";

export function useFcm() {
  // Keep SSR and the first client render identical — sync real permission after mount.
  const [token, setToken] = useState<string | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<
    NotificationPermission | "unsupported" | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!("Notification" in window)) {
      setNotificationPermission("unsupported");
      return;
    }

    setNotificationPermission(Notification.permission);
  }, []);

  const requestPermission = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      console.warn("Notifications are not supported in this browser.");
      return;
    }

    setIsLoading(true);
    try {
      const { getFcmToken } = await import(
        "@/features/notifications/services/get-fcm-token"
      );
      const deviceToken = await getFcmToken({ requestPermission: true });
      setNotificationPermission(Notification.permission);
      setToken(deviceToken);
    } catch (error) {
      console.error("Failed to request notification permission:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    token,
    notificationPermission,
    requestPermission,
    isLoading,
  };
}
