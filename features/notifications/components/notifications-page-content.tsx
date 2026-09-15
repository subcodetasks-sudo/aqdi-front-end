"use client";

import { useEffect } from "react";
import { Bell, BellOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useFcm } from "@/features/notifications/hooks/use-fcm";
import type { NotificationsPageLabels } from "@/features/notifications/types/notifications-page-labels";
import {
  useNotificationsInboxStore,
} from "@/features/notifications/stores/use-notifications-inbox-store";
import { usePersistStoreHydrated } from "@/features/shared/hooks/use-persist-store-hydrated";
import { cn } from "@/lib/utils";

type NotificationsPageContentProps = {
  labels: NotificationsPageLabels;
};

export default function NotificationsPageContent({
  labels,
}: NotificationsPageContentProps) {
  const isHydrated = usePersistStoreHydrated(
    useNotificationsInboxStore.persist,
  );
  const items = useNotificationsInboxStore((state) => state.items);
  const markAllRead = useNotificationsInboxStore((state) => state.markAllRead);
  const clearAll = useNotificationsInboxStore((state) => state.clearAll);
  const { notificationPermission, requestPermission, isLoading } = useFcm();

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    markAllRead();
  }, [isHydrated, markAllRead]);

  const visibleItems = isHydrated ? items : [];
  const showEnablePrompt =
    notificationPermission === "default" ||
    notificationPermission === "denied" ||
    notificationPermission === "unsupported";

  return (
    <section className="container py-10 md:py-14">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-brand md:text-3xl">
            {labels.title}
          </h1>
          <p className="max-w-xl text-sm leading-7 text-muted-foreground">
            {labels.subtitle}
          </p>
        </div>
        {visibleItems.length > 0 ? (
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            onClick={clearAll}
          >
            {labels.clearAll}
          </Button>
        ) : null}
      </header>

      {showEnablePrompt ? (
        <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-brand/15 bg-brand-background-green/40 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-brand shadow-sm">
              <BellOff className="size-5" aria-hidden="true" />
            </span>
            <div className="space-y-1">
              <p className="text-sm font-bold text-brand">
                {labels.enableTitle}
              </p>
              <p className="text-xs leading-6 text-muted-foreground">
                {notificationPermission === "denied"
                  ? labels.enableDenied
                  : notificationPermission === "unsupported"
                    ? labels.enableUnsupported
                    : labels.enableDescription}
              </p>
            </div>
          </div>
          {notificationPermission === "default" ? (
            <Button
              type="button"
              className="shrink-0 rounded-full bg-brand text-white hover:bg-brand/90"
              onClick={() => void requestPermission()}
              disabled={isLoading}
            >
              {isLoading ? labels.enableLoading : labels.enableAction}
            </Button>
          ) : null}
        </div>
      ) : null}

      {visibleItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl bg-white px-6 py-16 text-center shadow-sm">
          <span className="mb-4 flex size-14 items-center justify-center rounded-full bg-brand-background-green text-brand">
            <Bell className="size-6" aria-hidden="true" />
          </span>
          <p className="text-base font-bold text-brand">{labels.emptyTitle}</p>
          <p className="mt-2 max-w-sm text-sm leading-7 text-muted-foreground">
            {labels.emptyDescription}
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {visibleItems.map((item) => (
            <li
              key={item.id}
              className={cn(
                "rounded-2xl border bg-white px-4 py-4 shadow-sm",
                item.read ? "border-border/60" : "border-brand/20",
              )}
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-background-green text-brand">
                  <Bell className="size-4" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1 space-y-1 text-start">
                  <p className="text-sm font-bold text-brand">{item.title}</p>
                  {item.body ? (
                    <p className="text-xs leading-6 text-muted-foreground">
                      {item.body}
                    </p>
                  ) : null}
                  <p className="text-[11px] text-muted-foreground/80">
                    {new Intl.DateTimeFormat("ar-SA", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(item.createdAt)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
