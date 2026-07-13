"use client";

import { QueryClientProvider } from "@tanstack/react-query";

import { AppNotificationProvider } from "@/features/notifications/components/app-notification-provider";
import { getQueryClient } from "@/lib/react-query/get-query-client";

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AppNotificationProvider />
      {children}
    </QueryClientProvider>
  );
}
