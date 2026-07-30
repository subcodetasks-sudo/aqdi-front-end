"use client";

import { useState, type ReactNode } from "react";

type CreateContractFinanceAccordionProps = {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  collapsedSummary?: ReactNode;
  children: ReactNode;
};

export default function CreateContractFinanceAccordion({
  title,
  subtitle,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  collapsedSummary,
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
    <div
      dir="rtl"
      className="overflow-hidden rounded-2xl border border-[#e8e8e8] shadow-sm"
    >
      <div className="bg-white">
        <button
          type="button"
          onClick={handleToggle}
          aria-expanded={open}
          className="flex w-full items-start px-4 py-3 text-start"
        >
          <span className="min-w-0 space-y-1">
            <span className="block text-sm font-extrabold text-[#1a1a1a]">
              {title}
            </span>
            {subtitle ? (
              <span className="block text-xs leading-5 text-[#9a9a9a]">
                {subtitle}
              </span>
            ) : null}
          </span>
        </button>

        {!open && collapsedSummary ? (
          <div className="px-4 pb-3">{collapsedSummary}</div>
        ) : null}
      </div>

      {open ? (
        <div className="space-y-4 border-t border-[#f0f0f0] bg-[#FBFBFA] px-4 py-4">
          {children}
        </div>
      ) : null}
    </div>
  );
}
