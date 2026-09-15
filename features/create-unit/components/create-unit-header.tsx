"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

type CreateUnitHeaderProps = {
  backLabel: string;
  pageTitle: string;
};

export default function CreateUnitHeader({
  backLabel,
  pageTitle,
}: CreateUnitHeaderProps) {
  const router = useRouter();

  return (
    <div className="mb-8 flex justify-start">
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={backLabel}
          onClick={() => router.back()}
          className="inline-flex size-10 items-center justify-center rounded-full bg-gray-600 text-white shadow-sm transition-colors hover:bg-brand"
        >
          <ArrowRight className="size-4" aria-hidden="true" />
        </button>
        <span className="text-sm font-medium text-gray-600">{pageTitle}</span>
      </div>
    </div>
  );
}
