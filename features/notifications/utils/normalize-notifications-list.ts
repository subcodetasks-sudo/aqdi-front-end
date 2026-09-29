import type {
  NotificationApiItem,
  NotificationsListData,
  NotificationType,
} from "@/features/notifications/types/notification-item";

function toCount(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, value);
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
  }

  return 0;
}

export function isNotificationRead(value: unknown) {
  return value === true || value === 1 || value === "1";
}

function normalizeItem(raw: NotificationApiItem): NotificationApiItem {
  const record = raw as NotificationApiItem & { read_at?: string | null };
  const read =
    isNotificationRead(record.is_read) ||
    (typeof record.read_at === "string" && record.read_at.trim() !== "");

  return {
    ...raw,
    is_read: read,
  };
}

function listCoversEveryNotification(
  items: NotificationApiItem[],
  pagination: NotificationsListData["pagination"],
) {
  if (!pagination) {
    return true;
  }

  return pagination.last_page <= 1 || pagination.total <= items.length;
}

export function normalizeNotificationsList(
  data: NotificationsListData,
): NotificationsListData {
  const items = (Array.isArray(data.data) ? data.data : []).map(normalizeItem);
  const coversAll = listCoversEveryNotification(items, data.pagination);
  const unreadOnPage = items.filter((item) => !item.is_read).length;

  return {
    ...data,
    data: items,
    unread_notifications: coversAll
      ? unreadOnPage
      : toCount(data.unread_notifications),
    unread_payment: coversAll
      ? items.filter((item) => !item.is_read && item.type === "payment").length
      : toCount(data.unread_payment),
    unread_general: coversAll
      ? items.filter((item) => !item.is_read && item.type === "general").length
      : toCount(data.unread_general),
  };
}

export function markNotificationReadInList(
  data: NotificationsListData,
  id: number,
): NotificationsListData {
  const items = (data.data ?? []).map((item) =>
    item.id === id ? { ...item, is_read: true } : item,
  );

  return normalizeNotificationsList({ ...data, data: items });
}

export function markAllNotificationsReadInList(
  data: NotificationsListData,
  type?: NotificationType,
): NotificationsListData {
  const items = (data.data ?? []).map((item) =>
    !type || item.type === type ? { ...item, is_read: true } : item,
  );

  return normalizeNotificationsList({ ...data, data: items });
}
