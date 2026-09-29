"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { notificationsKeys } from "@/features/notifications/query-keys";
import { markAllNotificationsRead } from "@/features/notifications/services/mark-all-notifications-read";
import { markNotificationRead } from "@/features/notifications/services/mark-notification-read";
import type {
  NotificationsListData,
  NotificationType,
} from "@/features/notifications/types/notification-item";
import {
  markAllNotificationsReadInList,
  markNotificationReadInList,
} from "@/features/notifications/utils/normalize-notifications-list";

export function useNotificationActions() {
  const queryClient = useQueryClient();
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  function updateCachedLists(
    update: (current: NotificationsListData) => NotificationsListData,
  ) {
    queryClient.setQueriesData<NotificationsListData>(
      { queryKey: notificationsKeys.all },
      (current) => (current ? update(current) : current),
    );
  }

  async function markOneRead(id: number) {
    const result = await markNotificationRead(id);

    if (result.ok) {
      updateCachedLists((current) => markNotificationReadInList(current, id));
      await queryClient.invalidateQueries({ queryKey: notificationsKeys.all });
    }

    return result.ok;
  }

  async function markAllRead(type?: NotificationType) {
    if (isMarkingAll) {
      return false;
    }

    setIsMarkingAll(true);

    try {
      const result = await markAllNotificationsRead(type);

      if (result.ok) {
        updateCachedLists((current) =>
          markAllNotificationsReadInList(current, type),
        );
        await queryClient.invalidateQueries({ queryKey: notificationsKeys.all });
      }

      return result.ok;
    } finally {
      setIsMarkingAll(false);
    }
  }

  return { markOneRead, markAllRead, isMarkingAll };
}
