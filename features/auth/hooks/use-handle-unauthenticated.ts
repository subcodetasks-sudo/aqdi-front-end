"use client";

import { useRouter } from "next/navigation";

import { useAuthStore } from "@/features/auth/stores/use-auth-store";
import { useNotificationsInboxStore } from "@/features/notifications/stores/use-notifications-inbox-store";
import { clearClientAuthTokens } from "@/lib/api/client-token-storage";

export function useHandleUnauthenticated() {
  const router = useRouter();
  const clearUser = useAuthStore((state) => state.clearUser);
  const clearNotifications = useNotificationsInboxStore(
    (state) => state.clearAll,
  );

  return function handleUnauthenticated() {
    void import("@/features/notifications/services/get-fcm-token").then(
      ({ disconnectFcmToken }) => disconnectFcmToken(),
    );
    clearUser();
    clearClientAuthTokens();
    clearNotifications();
    const callbackUrl = `${window.location.pathname}${window.location.search}`;
    router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  };
}
