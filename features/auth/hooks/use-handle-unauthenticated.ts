"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { useAuthStore } from "@/features/auth/stores/use-auth-store";
import { notificationsKeys } from "@/features/notifications/query-keys";
import { clearClientAuthTokens } from "@/lib/api/client-token-storage";

export function useHandleUnauthenticated() {
  const router = useRouter();
  const clearUser = useAuthStore((state) => state.clearUser);
  const queryClient = useQueryClient();

  return function handleUnauthenticated() {
    void import("@/features/notifications/services/get-fcm-token").then(
      ({ disconnectFcmToken }) => disconnectFcmToken(),
    );
    clearUser();
    clearClientAuthTokens();
    queryClient.removeQueries({ queryKey: notificationsKeys.all });
    const callbackUrl = `${window.location.pathname}${window.location.search}`;
    router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  };
}
