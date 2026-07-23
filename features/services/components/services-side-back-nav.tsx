"use client";

import { ArrowRight, Home, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { useServicesPageMeta } from "@/features/services/components/services-page-provider";
import { cn } from "@/lib/utils";

const pillBaseClassName =
  "inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-bold transition-colors";

export default function ServicesSideBackNav() {
  const { meta } = useServicesPageMeta();
  const router = useRouter();
  const t = useTranslations("services.nav");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const shell = document.querySelector<HTMLElement>("[data-services-layout]");

    if (!shell) {
      return;
    }

    if (isDarkMode) {
      shell.classList.add("dark", "services-dark-shell");
    } else {
      shell.classList.remove("dark", "services-dark-shell");
    }

    return () => {
      shell.classList.remove("dark", "services-dark-shell");
    };
  }, [isDarkMode]);

  if (!meta || meta.hideBack) {
    return null;
  }

  const backHref = meta.backHref ?? "/";
  const isHomeLink = !meta.useRouterBack && (backHref === "/" || backHref === "");
  const homeLabel = isHomeLink ? t("home") : meta.backLabel;
  const hasTrailing = Boolean(meta.pageBadge || meta.pageAction);

  function renderBackControl() {
    const className = cn(
      pillBaseClassName,
      "bg-brand-background-green text-brand hover:bg-brand-background-green/80 dark:bg-[#16352f] dark:text-[#7dccc0] dark:hover:bg-[#1c4039]",
    );

    const icon = isHomeLink ? (
      <Home className="size-4 shrink-0" aria-hidden="true" />
    ) : (
      <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
    );

    if (meta.useRouterBack) {
      return (
        <button
          type="button"
          aria-label={meta.backLabel}
          onClick={() => router.back()}
          className={className}
        >
          {icon}
          {homeLabel}
        </button>
      );
    }

    return (
      <Link href={backHref} aria-label={meta.backLabel} className={className}>
        {icon}
        {homeLabel}
      </Link>
    );
  }

  return (
    <aside className="mb-4 sm:mb-5">
      <div className="flex w-full flex-wrap items-center gap-2 rounded-full bg-white p-2 shadow-sm dark:border dark:border-[#2f403b] dark:bg-[#1a2421]">
        {renderBackControl()}

        {meta.pageTitle ? (
          <span
            className={cn(
              pillBaseClassName,
              "max-w-[min(100%,14rem)] truncate bg-[#fff1e6] text-[#e67e22] sm:max-w-xs dark:bg-[#3a2a1c] dark:text-[#f0b27a]",
            )}
            title={meta.pageTitle}
          >
            {meta.pageTitle}
          </span>
        ) : null}

        {hasTrailing ? (
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            {meta.pageBadge ? (
              <span className="truncate text-xs font-semibold text-brand sm:text-sm dark:text-[#7dccc0]">
                {meta.pageBadge}
              </span>
            ) : null}

            {meta.pageAction ? (
              <Link
                href={meta.pageAction.href}
                className={cn(
                  pillBaseClassName,
                  "bg-brand text-white hover:bg-brand/90",
                )}
              >
                {meta.pageAction.label}
              </Link>
            ) : null}
          </div>
        ) : null}

        <button
          type="button"
          aria-label={isDarkMode ? t("light") : t("dark")}
          aria-pressed={isDarkMode}
          onClick={() => setIsDarkMode((current) => !current)}
          className={cn(
            pillBaseClassName,
            "ms-auto border border-[#e4e4e4] bg-white text-brand hover:bg-brand-background",
            isDarkMode &&
              "border-brand-secondary/40 bg-brand text-white hover:bg-brand/90",
          )}
        >
          {isDarkMode ? (
            <Sun className="size-4 shrink-0" aria-hidden="true" />
          ) : (
            <Moon className="size-4 shrink-0" aria-hidden="true" />
          )}
          {isDarkMode ? t("light") : t("dark")}
        </button>
      </div>
    </aside>
  );
}
