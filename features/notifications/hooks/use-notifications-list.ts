"use client";

import { useQuery } from "@tanstack/react-query";

import { notificationsKeys } from "@/features/notifications/query-keys";
import { getNotifications } from "@/features/notifications/services/get-notifications";
import type { NotificationType } from "@/features/notifications/types/notification-item";

export function useNotificationsList(type?: NotificationType, page = 1) {
  return useQuery({
    queryKey: notificationsKeys.list(type, page),
    queryFn: () => getNotifications(type, page),
    staleTime: 0,
  });
}
