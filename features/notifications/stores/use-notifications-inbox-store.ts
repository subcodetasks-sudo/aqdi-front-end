import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type InboxNotification = {
  id: string;
  title: string;
  body: string;
  icon?: string;
  createdAt: number;
  read: boolean;
};

type NotificationsInboxState = {
  items: InboxNotification[];
  addNotification: (payload: {
    title: string;
    body: string;
    icon?: string;
  }) => void;
  markAllRead: () => void;
  clearAll: () => void;
};

const MAX_ITEMS = 50;

export const useNotificationsInboxStore = create<NotificationsInboxState>()(
  persist(
    (set) => ({
      items: [],
      addNotification: ({ title, body, icon }) =>
        set((state) => ({
          items: [
            {
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
              title,
              body,
              icon,
              createdAt: Date.now(),
              read: false,
            },
            ...state.items,
          ].slice(0, MAX_ITEMS),
        })),
      markAllRead: () =>
        set((state) => ({
          items: state.items.map((item) =>
            item.read ? item : { ...item, read: true },
          ),
        })),
      clearAll: () => set({ items: [] }),
    }),
    {
      name: "aqdi-notifications-inbox",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export function selectUnreadNotificationsCount(
  state: NotificationsInboxState,
): number {
  return state.items.reduce((count, item) => count + (item.read ? 0 : 1), 0);
}
