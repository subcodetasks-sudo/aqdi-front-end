"use client";

import { forwardRef } from "react";
import Link from "next/link";

import CustomIcon from "@/features/shared/components/custom-icon";
import {
  selectUnreadNotificationsCount,
  useNotificationsInboxStore,
} from "@/features/notifications/stores/use-notifications-inbox-store";
import { usePersistStoreHydrated } from "@/features/shared/hooks/use-persist-store-hydrated";
import { cn } from "@/lib/utils";

type NotificationsNavButtonProps = {
  label: string;
  showLabel?: boolean;
  className?: string;
};

const NotificationsNavButton = forwardRef<
  HTMLAnchorElement,
  NotificationsNavButtonProps
>(function NotificationsNavButton(
  { label, showLabel = false, className },
  ref,
) {
  const isHydrated = usePersistStoreHydrated(
    useNotificationsInboxStore.persist,
  );
  const unreadCount = useNotificationsInboxStore(selectUnreadNotificationsCount);
  const visibleUnreadCount = isHydrated ? unreadCount : 0;

  return (
    <Link
      ref={ref}
      href="/notifications"
      aria-label={label}
      className={cn(
        "group/button relative inline-flex shrink-0 items-center justify-center border border-border/80 bg-background bg-clip-padding text-sm font-medium text-muted-foreground whitespace-nowrap transition-all outline-none select-none hover:border-brand/30 hover:bg-muted hover:text-brand focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        showLabel
          ? "h-12 w-full gap-2 rounded-full px-2.5"
          : "size-12 rounded-full",
        className,
      )}
    >
      <CustomIcon
        src="/icons/notification-bell.svg"
        size={16}
        className="text-gray-600"
      />
      {showLabel ? <span className="leading-none">{label}</span> : null}
      {visibleUnreadCount > 0 ? (
        <span className="absolute -top-1 -end-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
          {visibleUnreadCount > 99 ? "99+" : visibleUnreadCount}
        </span>
      ) : null}
    </Link>
  );
});

export default NotificationsNavButton;
