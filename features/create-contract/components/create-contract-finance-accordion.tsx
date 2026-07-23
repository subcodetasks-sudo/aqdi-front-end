"use client";

import { ChevronUp } from "lucide-react";
import { useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type CreateContractFinanceAccordionProps = {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
};

export default function CreateContractFinanceAccordion({
  title,
  subtitle,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  children,
}: CreateContractFinanceAccordionProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : uncontrolledOpen;

  function handleToggle() {
    const next = !open;

    if (!isControlled) {
      setUncontrolledOpen(next);
    }

    onOpenChange?.(next);
  }

  return (
    <div dir="rtl" className="overflow-hidden rounded-2xl border border-[#e8e8e8]">
      <button
        type="button"
        onClick={handleToggle}
        className="flex w-full items-start justify-between gap-3 bg-[#f7f7f7] px-4 py-3 text-start"
      >
        <span className="min-w-0 space-y-1">
          <span className="block text-sm font-extrabold text-brand">{title}</span>
          {subtitle ? (
            <span className="block text-xs leading-5 text-[#9a9a9a]">
              {subtitle}
            </span>
          ) : null}
        </span>
        <ChevronUp
          className={cn(
            "mt-0.5 size-5 shrink-0 text-[#9a9a9a] transition-transform",
            open ? "rotate-0" : "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div className="space-y-4 border-t border-[#f0f0f0] bg-white px-4 py-4">
          {children}
        </div>
      ) : null}
    </div>
  );
}
