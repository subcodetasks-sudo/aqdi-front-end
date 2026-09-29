import type { NotificationType } from "@/features/notifications/types/notification-item";

export const notificationsKeys = {
  all: ["notifications"] as const,
  list: (type: NotificationType | undefined, page: number) =>
    [...notificationsKeys.all, "list", type ?? "all", page] as const,
};
