"use server";

import { apiRequest } from "@/lib/api/api-request";
import type {
  NotificationsListApiResponse,
  NotificationsListData,
  NotificationType,
} from "@/features/notifications/types/notification-item";
import { normalizeNotificationsList } from "@/features/notifications/utils/normalize-notifications-list";

export async function getNotifications(
  type?: NotificationType,
  page = 1,
): Promise<NotificationsListData> {
  const params = new URLSearchParams();
  if (type) {
    params.set("type", type);
  }
  if (page > 1) {
    params.set("page", String(page));
  }
  const query = params.toString();

  const response = await apiRequest<NotificationsListApiResponse>(
    `/notifications${query ? `?${query}` : ""}`,
    {
      method: "GET",
      cache: "no-store",
      next: { revalidate: 0 },
    },
  );

  if (!response.ok || !response.data?.success) {
    throw new Error(
      response.error || response.data?.message || "Failed to fetch notifications",
    );
  }

  return normalizeNotificationsList(response.data.data);
}
