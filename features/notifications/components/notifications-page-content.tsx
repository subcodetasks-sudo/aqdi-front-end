"use client";

import { useState } from "react";
import { Bell, BellOff, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFcm } from "@/features/notifications/hooks/use-fcm";
import { useNotificationActions } from "@/features/notifications/hooks/use-notification-actions";
import { useNotificationsList } from "@/features/notifications/hooks/use-notifications-list";
import type { NotificationsPageLabels } from "@/features/notifications/types/notifications-page-labels";
import type { NotificationType } from "@/features/notifications/types/notification-item";
import { cn } from "@/lib/utils";

type NotificationsPageContentProps = {
  labels: NotificationsPageLabels;
};

type TabValue = NotificationType | "all";

export default function NotificationsPageContent({
  labels,
}: NotificationsPageContentProps) {
  const [tab, setTab] = useState<TabValue>("all");
  const [page, setPage] = useState(1);
  const type = tab === "all" ? undefined : tab;
  const { data, isLoading, isError } = useNotificationsList(type, page);
  const { markOneRead, markAllRead, isMarkingAll } = useNotificationActions();
  const { notificationPermission, requestPermission, isLoading: isFcmLoading } =
    useFcm();

  const items = data?.data ?? [];
  const pagination = data?.pagination ?? null;
  const showEnablePrompt =
    notificationPermission === "default" ||
    notificationPermission === "denied" ||
    notificationPermission === "unsupported";

  function handleTabChange(value: string) {
    setTab(value as TabValue);
    setPage(1);
  }

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
        {items.length > 0 ? (
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            disabled={isMarkingAll}
            onClick={() => void markAllRead(type)}
          >
            {isMarkingAll ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : null}
            {isMarkingAll ? labels.markingAllRead : labels.markAllRead}
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
              disabled={isFcmLoading}
            >
              {isFcmLoading ? labels.enableLoading : labels.enableAction}
            </Button>
          ) : null}
        </div>
      ) : null}

      <Tabs value={tab} onValueChange={handleTabChange} className="mb-5">
        <TabsList>
          <TabsTrigger value="all">{labels.tabs.all}</TabsTrigger>
          <TabsTrigger value="payment">{labels.tabs.payment}</TabsTrigger>
          <TabsTrigger value="general">{labels.tabs.general}</TabsTrigger>
        </TabsList>
      </Tabs>

      {isError ? (
        <div className="flex flex-col items-center justify-center rounded-3xl bg-white px-6 py-16 text-center shadow-sm">
          <p className="text-sm font-medium text-destructive">
            {labels.loadError}
          </p>
        </div>
      ) : isLoading ? (
        <ul className="space-y-3">
          {[0, 1, 2].map((index) => (
            <li
              key={index}
              className="h-20 animate-pulse rounded-2xl bg-white shadow-sm"
            />
          ))}
        </ul>
      ) : items.length === 0 ? (
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
          {items.map((item) => (
            <li
              key={item.id}
              className={cn(
                "rounded-2xl border bg-white shadow-sm",
                item.is_read ? "border-border/60" : "border-brand/20",
              )}
            >
              <button
                type="button"
                onClick={() => {
                  if (!item.is_read) {
                    void markOneRead(item.id);
                  }
                }}
                className="flex w-full items-start gap-3 px-4 py-4 text-start"
              >
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-background-green text-brand">
                  <Bell className="size-4" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="text-sm font-bold text-brand">{item.title}</p>
                  {item.body ? (
                    <p className="text-xs leading-6 text-muted-foreground">
                      {item.body}
                    </p>
                  ) : null}
                  <p className="text-[11px] text-muted-foreground/80">
                    {item.created_at}
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {pagination && pagination.last_page > 1 ? (
        <nav
          aria-label="pagination"
          className="mt-6 flex items-center justify-center gap-2"
        >
          <button
            type="button"
            aria-label={labels.pagination.previous}
            disabled={pagination.current_page === 1}
            onClick={() => setPage((current) => current - 1)}
            className="inline-flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-brand/10 hover:text-brand disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>

          <span className="text-sm font-medium text-muted-foreground">
            {pagination.current_page} / {pagination.last_page}
          </span>

          <button
            type="button"
            aria-label={labels.pagination.next}
            disabled={pagination.current_page === pagination.last_page}
            onClick={() => setPage((current) => current + 1)}
            className="inline-flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-brand/10 hover:text-brand disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
        </nav>
      ) : null}
    </section>
  );
}
