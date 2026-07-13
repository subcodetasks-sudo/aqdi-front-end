import { useState, useCallback } from "react";

import { getFcmToken } from "@/features/notifications/services/get-fcm-token";

export const useFcm = () => {
  const [token, setToken] = useState<string | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<
    NotificationPermission | "unsupported"
  >(() => {
    if (typeof window === "undefined") return "default";
    if (!("Notification" in window)) return "unsupported";
    return Notification.permission;
  });
  const [isLoading, setIsLoading] = useState(false);

  const requestPermission = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      console.warn("Notifications are not supported in this browser.");
      return;
    }

    setIsLoading(true);
    try {
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
};
