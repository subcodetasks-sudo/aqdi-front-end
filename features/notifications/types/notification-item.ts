export type NotificationType = "payment" | "general";

export type NotificationApiItem = {
  id: number;
  type: NotificationType;
  title: string;
  body: string;
  is_read: boolean;
  data: Record<string, unknown> | null;
  created_at: string;
};

export type NotificationsPagination = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type NotificationsListData = {
  unread_notifications: number;
  unread_payment: number;
  unread_general: number;
  data: NotificationApiItem[] | null;
  pagination: NotificationsPagination | null;
};

export type NotificationsListApiResponse = {
  message: string;
  code: number;
  success: boolean;
  data: NotificationsListData;
};

export type MarkNotificationReadApiResponse = {
  message: string;
  code: number;
  success: boolean;
  data: NotificationApiItem;
};

export type MarkAllNotificationsReadData = {
  updated: number;
  unread_notifications: number;
  unread_payment: number;
  unread_general: number;
};

export type MarkAllNotificationsReadApiResponse = {
  message: string;
  code: number;
  success: boolean;
  data: MarkAllNotificationsReadData;
};
