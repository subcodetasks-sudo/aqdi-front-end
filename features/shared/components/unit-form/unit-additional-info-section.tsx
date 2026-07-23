"use client";

import { ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type UnitAdditionalInfoSectionProps = {
  toggleLabel: string;
  defaultOpen?: boolean;
  children: ReactNode;
};

export default function UnitAdditionalInfoSection({
  toggleLabel,
  defaultOpen = false,
  children,
}: UnitAdditionalInfoSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-2xl border border-[#e8e8e8] bg-white">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex h-12 w-full items-center justify-between gap-3 px-4 text-sm font-semibold text-brand"
      >
        <span>{toggleLabel}</span>
        <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-[#e8e8e8]">
          <ChevronDown
            className={cn(
              "size-4 text-brand transition-transform",
              open ? "rotate-180" : "rotate-0",
            )}
            aria-hidden="true"
          />
        </span>
      </button>

      {open ? (
        <div className="space-y-4 border-t border-[#f0f0f0] px-4 py-4">
          {children}
        </div>
      ) : null}
    </div>
  );
}
