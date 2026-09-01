"use client";

import { Home, Moon, Sun } from "lucide-react";
import { useRouter } from "next/navigation";

import { scheduleCreatePropertyDraftResetOnUnmount } from "@/features/create-property/utils/reset-create-property-draft";
import type { CreatePropertyLabels } from "@/features/create-property/types/create-property-labels";
import { cn } from "@/lib/utils";

type CreatePropertyHeaderProps = {
  pageTitle: string;
  labels: CreatePropertyLabels["header"];
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
};

const iconButtonClassName =
  "inline-flex size-10 shrink-0 items-center justify-center rounded-full transition-colors sm:h-11 sm:w-auto sm:gap-2 sm:px-4";

export default function CreatePropertyHeader({
  pageTitle,
  labels,
  isDarkMode,
  onToggleDarkMode,
}: CreatePropertyHeaderProps) {
  const router = useRouter();

  function handleHomeClick() {
    scheduleCreatePropertyDraftResetOnUnmount();
    router.push("/");
  }

  return (
    <div className="sticky top-0 z-30  pb-2">
      <div className="flex w-full items-center gap-1.5 rounded-2xl bg-white p-1.5 shadow-sm sm:gap-2 sm:p-2 dark:border dark:border-[#2f403b] dark:bg-[#1a2421]">
        <button
          type="button"
          onClick={handleHomeClick}
          aria-label={labels.home}
          className={cn(
            iconButtonClassName,
            "bg-brand-background-green text-brand hover:bg-brand-background-green/80 dark:bg-[#16352f] dark:text-[#7dccc0] dark:hover:bg-[#1c4039]",
          )}
        >
          <Home className="size-4 shrink-0" aria-hidden="true" />
          <span className="hidden truncate sm:inline">{labels.home}</span>
        </button>

        <span
          className="inline-flex h-10 min-w-0 flex-1 items-center justify-center truncate rounded-full bg-brand px-3 text-xs font-bold text-white sm:h-11 sm:flex-none sm:px-4 sm:text-sm"
          title={pageTitle}
        >
          <span className="truncate">{pageTitle}</span>
        </span>

        <button
          type="button"
          aria-label={isDarkMode ? labels.light : labels.dark}
          aria-pressed={isDarkMode}
          onClick={onToggleDarkMode}
          className={cn(
            iconButtonClassName,
            "ms-auto border border-[#e4e4e4] bg-white text-brand hover:bg-brand-background dark:border-[#2f403b]",
            isDarkMode &&
              "border-brand-secondary/40 bg-brand text-white hover:bg-brand/90 dark:border-brand-secondary/40 dark:bg-brand",
          )}
        >
          {isDarkMode ? (
            <Sun className="size-4 shrink-0" aria-hidden="true" />
          ) : (
            <Moon className="size-4 shrink-0" aria-hidden="true" />
          )}
          <span className="hidden truncate sm:inline">
            {isDarkMode ? labels.light : labels.dark}
          </span>
        </button>
      </div>
    </div>
  );
}
