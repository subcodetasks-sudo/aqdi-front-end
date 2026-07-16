"use client";

import { ChevronUp } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

type UnitAdditionalInfoSectionProps = {
  toggleLabel: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

export default function UnitAdditionalInfoSection({
  toggleLabel,
  defaultOpen = false,
  children,
}: UnitAdditionalInfoSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div dir="rtl" className="space-y-4">
      <button
        type="button"
        dir="rtl"
        onClick={() => setOpen((current) => !current)}
        className="flex h-14 w-full items-center justify-between rounded-full border border-brand-secondary bg-white px-5 text-sm font-semibold text-brand-secondary"
      >
        <span>{toggleLabel}</span>
        <ChevronUp
          className={cn(
            "size-5 shrink-0 transition-transform",
            open ? "rotate-0" : "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      {open ? <div className="space-y-4">{children}</div> : null}
    </div>
  );
}
