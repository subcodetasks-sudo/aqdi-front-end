"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import AppNotificationToaster from "@/features/notifications/components/app-notification-toaster";
import { notificationsKeys } from "@/features/notifications/query-keys";
import { useContractsLiveStore } from "@/features/requests/stores/use-contracts-live-store";

type ForegroundPayload = {
  notification?: {
    title?: string;
    body?: string;
    icon?: string;
  };
  data?: {
    title?: string;
    body?: string;
    icon?: string;
  };
};

function parseForegroundMessage(payload: ForegroundPayload) {
  return {
    title: payload.notification?.title || payload.data?.title || "إشعار جديد",
    body: payload.notification?.body || payload.data?.body || "",
    icon: payload.notification?.icon || payload.data?.icon,
  };
}

export function AppNotificationProvider() {
  const applyFirebasePatch = useContractsLiveStore(
    (state) => state.applyFirebasePatch,
  );
  const queryClient = useQueryClient();

  useEffect(() => {
    let unsubscribe = () => {};
    let cancelled = false;

    void (async () => {
      const [
        { getFirebaseMessagingAsync, initFirebaseAnalytics, onForegroundMessage },
        { registerFirebaseServiceWorker },
        { showAppNotification },
        { parseContractStatusFirebasePayload },
      ] = await Promise.all([
        import("@/features/notifications/services/firebase-client"),
        import("@/features/notifications/services/get-fcm-token"),
        import("@/features/notifications/services/show-app-notification"),
        import("@/features/requests/utils/parse-contract-status-firebase-payload"),
      ]);

      if (cancelled) {
        return;
      }

      void initFirebaseAnalytics();
      void registerFirebaseServiceWorker();

      const messaging = await getFirebaseMessagingAsync();
      if (!messaging || cancelled) {
        return;
      }

      unsubscribe = onForegroundMessage((payload) => {
        const message = parseForegroundMessage(payload);
        void queryClient.invalidateQueries({ queryKey: notificationsKeys.all });

        const contractPatch = parseContractStatusFirebasePayload(payload);

        if (contractPatch) {
          applyFirebasePatch(contractPatch);

          if (contractPatch.status_label) {
            toast.success(contractPatch.status_label);
          } else {
            showAppNotification(message);
          }
          return;
        }

        showAppNotification(message);
      });
    })();

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [applyFirebasePatch, queryClient]);

  return <AppNotificationToaster />;
}
