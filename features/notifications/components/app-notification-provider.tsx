"use client";

import { useEffect } from "react";
import type { MessagePayload } from "firebase/messaging";
import { toast } from "sonner";

import AppNotificationToaster from "@/features/notifications/components/app-notification-toaster";
import {
  getFirebaseMessagingAsync,
  initFirebaseAnalytics,
  onForegroundMessage,
} from "@/features/notifications/services/firebase-client";
import { registerFirebaseServiceWorker } from "@/features/notifications/services/get-fcm-token";
import { showAppNotification } from "@/features/notifications/services/show-app-notification";
import { useContractsLiveStore } from "@/features/requests/stores/use-contracts-live-store";
import { parseContractStatusFirebasePayload } from "@/features/requests/utils/parse-contract-status-firebase-payload";

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
  const applyFirebasePatch = useContractsLiveStore(
    (state) => state.applyFirebasePatch,
  );

  useEffect(() => {
    void initFirebaseAnalytics();
    void registerFirebaseServiceWorker();

    let unsubscribe = () => {};

    void getFirebaseMessagingAsync().then((messaging) => {
      if (!messaging) {
        return;
      }

      unsubscribe = onForegroundMessage((payload) => {
        const contractPatch = parseContractStatusFirebasePayload(payload);

        if (contractPatch) {
          applyFirebasePatch(contractPatch);

          if (contractPatch.status_label) {
            toast.success(contractPatch.status_label);
          } else {
            showAppNotification(parseForegroundMessage(payload));
          }
          return;
        }

        showAppNotification(parseForegroundMessage(payload));
      });
    });

    return () => {
      unsubscribe();
    };
  }, [applyFirebasePatch]);

  return <AppNotificationToaster />;
}
