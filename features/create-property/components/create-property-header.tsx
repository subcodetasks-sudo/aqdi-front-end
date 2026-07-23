"use client";

import { Home, Moon, Sun } from "lucide-react";
import { useRouter } from "next/navigation";

import { useCreatePropertyDraftStore } from "@/features/create-property/stores/use-create-property-draft-store";
import type { CreatePropertyLabels } from "@/features/create-property/types/create-property-labels";
import { cn } from "@/lib/utils";

type CreatePropertyHeaderProps = {
  pageTitle: string;
  labels: CreatePropertyLabels["header"];
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
};

const pillBaseClassName =
  "inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-bold transition-colors";

export default function CreatePropertyHeader({
  pageTitle,
  labels,
  isDarkMode,
  onToggleDarkMode,
}: CreatePropertyHeaderProps) {
  const router = useRouter();
  const resetDraft = useCreatePropertyDraftStore((state) => state.resetDraft);

  function handleHomeClick() {
    resetDraft();
    router.push("/");
  }

  return (
    <div className="relative flex w-full items-center gap-2 rounded-full bg-white p-2 shadow-sm dark:border dark:border-[#2f403b] dark:bg-[#1a2421]">
      <button
        type="button"
        onClick={handleHomeClick}
        className={cn(
          pillBaseClassName,
          "relative z-10 bg-brand-background-green text-brand hover:bg-brand-background-green/80 dark:bg-[#16352f] dark:text-[#7dccc0] dark:hover:bg-[#1c4039]",
        )}
      >
        <Home className="size-4 shrink-0" aria-hidden="true" />
        {labels.home}
      </button>

      <h1 className="pointer-events-none absolute inset-x-14 text-center text-sm font-extrabold text-brand sm:inset-x-0 sm:text-base md:text-lg dark:text-[#7dccc0]">
        {pageTitle}
      </h1>

      <button
        type="button"
        aria-label={isDarkMode ? labels.light : labels.dark}
        aria-pressed={isDarkMode}
        onClick={onToggleDarkMode}
        className={cn(
          pillBaseClassName,
          "relative z-10 ms-auto border border-[#e4e4e4] bg-white text-brand hover:bg-brand-background",
          isDarkMode &&
            "border-brand-secondary/40 bg-brand text-white hover:bg-brand/90",
        )}
      >
        {isDarkMode ? (
          <Sun className="size-4 shrink-0" aria-hidden="true" />
        ) : (
          <Moon className="size-4 shrink-0" aria-hidden="true" />
        )}
        {isDarkMode ? labels.light : labels.dark}
      </button>
    </div>
  );
}
