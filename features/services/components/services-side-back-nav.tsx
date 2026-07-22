"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useServicesPageMeta } from "@/features/services/components/services-page-provider";

export default function ServicesSideBackNav() {
  const { meta } = useServicesPageMeta();
  const router = useRouter();

  if (!meta || meta.hideBack) {
    return null;
  }

  const buttonClassName =
    "inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-600 text-white shadow-sm transition-colors hover:bg-brand";

  const hasTrailing = Boolean(meta.pageBadge || meta.pageAction);

  return (
    <aside
      className={`mb-4 flex items-center gap-3 sm:mb-5 ${
        hasTrailing ? "justify-between" : "justify-start"
      }`}
    >
      <div className="flex min-w-0 items-center gap-2">
        {meta.useRouterBack ? (
          <button
            type="button"
            aria-label={meta.backLabel}
            onClick={() => router.back()}
            className={buttonClassName}
          >
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        ) : (
          <Link
            href={meta.backHref ?? "/"}
            aria-label={meta.backLabel}
            className={buttonClassName}
          >
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        )}

        {meta.pageTitle ? (
          <span className="truncate text-sm font-medium text-gray-600">
            {meta.pageTitle}
          </span>
        ) : null}
      </div>

      {hasTrailing ? (
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {meta.pageBadge ? (
            <span className="text-xs font-semibold text-brand sm:text-sm">
              {meta.pageBadge}
            </span>
          ) : null}

          {meta.pageAction ? (
            <Link
              href={meta.pageAction.href}
              className="inline-flex h-10 items-center justify-center rounded-full bg-brand px-3 text-xs font-bold text-white transition-opacity hover:opacity-90 sm:px-4 sm:text-sm"
            >
              {meta.pageAction.label}
            </Link>
          ) : null}
        </div>
      ) : null}
    </aside>
  );
}
