"use client";

import dynamic from "next/dynamic";
import { QueryClientProvider } from "@tanstack/react-query";

import { getQueryClient } from "@/lib/react-query/get-query-client";

const AppNotificationProvider = dynamic(
  () =>
    import("@/features/notifications/components/app-notification-provider").then(
      (module) => module.AppNotificationProvider,
    ),
  { ssr: false },
);

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AppNotificationProvider />
      {children}
    </QueryClientProvider>
  );
}
