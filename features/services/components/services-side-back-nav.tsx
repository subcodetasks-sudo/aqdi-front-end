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
    "inline-flex size-10 items-center justify-center rounded-full bg-gray-600 text-white shadow-sm transition-colors hover:bg-brand";

  return (
    <aside className="mb-4 flex justify-start sm:mb-5">
      <div className="flex items-center gap-2">
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
          <span className="text-sm font-medium text-gray-600">{meta.pageTitle}</span>
        ) : null}
      </div>
    </aside>
  );
}
