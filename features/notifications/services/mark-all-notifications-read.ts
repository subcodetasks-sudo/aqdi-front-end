"use server";

import { apiRequest } from "@/lib/api/api-request";
import type {
  MarkAllNotificationsReadApiResponse,
  MarkAllNotificationsReadData,
  NotificationType,
} from "@/features/notifications/types/notification-item";

export async function markAllNotificationsRead(type?: NotificationType): Promise<
  | { ok: true; data: MarkAllNotificationsReadData }
  | { ok: false; error: string }
> {
  const response = await apiRequest<MarkAllNotificationsReadApiResponse>(
    "/notifications/read",
    {
      method: "POST",
      body: JSON.stringify(type ? { type } : {}),
      cache: "no-store",
    },
  );

  if (!response.ok || !response.data?.success) {
    return {
      ok: false,
      error:
        response.error ||
        response.data?.message ||
        "Failed to mark notifications as read",
    };
  }

  return { ok: true, data: response.data.data };
}
