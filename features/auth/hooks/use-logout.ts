"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { logoutUser } from "@/features/auth/services/logout-user";
import { useAuthStore } from "@/features/auth/stores/use-auth-store";
import { useNotificationsInboxStore } from "@/features/notifications/stores/use-notifications-inbox-store";
import {
  clearClientAuthTokens,
  getClientRefreshToken,
} from "@/lib/api/client-token-storage";

export function useLogout() {
  const router = useRouter();
  const clearUser = useAuthStore((state) => state.clearUser);
  const clearNotifications = useNotificationsInboxStore(
    (state) => state.clearAll,
  );
  const [isLoading, setIsLoading] = useState(false);

  async function logout() {
    setIsLoading(true);

    try {
      const { getStoredFcmToken, getFcmToken, disconnectFcmToken } = await import(
        "@/features/notifications/services/get-fcm-token"
      );

      let fcmToken = getStoredFcmToken();

      // Prefer a cached token so logout is never blocked on Firebase; fall back
      // briefly if permission was already granted but the cache is empty.
      if (!fcmToken && typeof Notification !== "undefined" && Notification.permission === "granted") {
        fcmToken = await Promise.race([
          getFcmToken({ requestPermission: false }),
          new Promise<null>((resolve) => {
            window.setTimeout(() => resolve(null), 800);
          }),
        ]);
      }

      const response = await logoutUser({
        fcmToken,
        refreshToken: getClientRefreshToken(),
      });

      if (!response.ok) {
        return {
          ok: false as const,
          error: response.error,
        };
      }

      // Drop the local FCM registration so the notification icon / service
      // worker stop receiving pushes after this session ends.
      await disconnectFcmToken();
      clearUser();
      clearClientAuthTokens();
      clearNotifications();
      router.push("/login");

      return {
        ok: true as const,
        message: response.message,
      };
    } finally {
      setIsLoading(false);
    }
  }

  return {
    logout,
    isLoading,
  };
}
