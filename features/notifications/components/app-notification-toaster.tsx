"use client";

import { Toaster } from "@/components/ui/sonner";
import { APP_NOTIFICATION_TOASTER_ID } from "@/features/notifications/constants/app-notification-toaster-id";

export default function AppNotificationToaster() {
  return (
    <Toaster
      id={APP_NOTIFICATION_TOASTER_ID}
      position="top-center"
      closeButton={false}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "!w-auto !max-w-none !p-0 !bg-transparent !border-0 !shadow-none",
        },
      }}
    />
  );
}
