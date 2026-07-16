"use client";

import { toast } from "sonner";

import AppNotificationToast from "@/features/notifications/components/app-notification-toast";
import { APP_NOTIFICATION_TOASTER_ID } from "@/features/notifications/constants/app-notification-toaster-id";

export type AppNotificationPayload = {
  title: string;
  body: string;
  icon?: string;
};

export function showAppNotification(
  notification: AppNotificationPayload,
  options?: { durationMs?: number },
) {
  return toast.custom(
    (id) => (
      <AppNotificationToast
        title={notification.title}
        body={notification.body}
        onDismiss={() => toast.dismiss(id)}
      />
    ),
    {
      toasterId: APP_NOTIFICATION_TOASTER_ID,
      duration: options?.durationMs ?? 6000,
    },
  );
}
