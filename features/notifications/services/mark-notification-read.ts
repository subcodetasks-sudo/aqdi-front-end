"use server";

import { apiRequest } from "@/lib/api/api-request";
import type { MarkNotificationReadApiResponse } from "@/features/notifications/types/notification-item";

export async function markNotificationRead(id: number): Promise<
  | { ok: true }
  | { ok: false; error: string }
> {
  const response = await apiRequest<MarkNotificationReadApiResponse>(
    `/notifications/${id}/read`,
    {
      method: "POST",
      cache: "no-store",
    },
  );

  if (!response.ok || !response.data?.success) {
    return {
      ok: false,
      error:
        response.error ||
        response.data?.message ||
        "Failed to mark notification as read",
    };
  }

  return { ok: true };
}
