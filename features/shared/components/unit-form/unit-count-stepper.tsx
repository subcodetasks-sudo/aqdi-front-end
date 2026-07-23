"use client";

import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";

type UnitCountStepperProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  required?: boolean;
  max?: number;
  className?: string;
};

function parseCount(value: string) {
  if (value === "") {
    return 0;
  }

  const parsed = Number(value.replace(/\D/g, ""));
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function formatCount(value: number) {
  return value === 0 ? "" : String(value);
}

export default function UnitCountStepper({
  label,
  value,
  onChange,
  hint,
  required = false,
  max = 99,
  className,
}: UnitCountStepperProps) {
  const currentCount = parseCount(value);
  const canDecrease = currentCount > 0;
  const canIncrease = currentCount < max;

  function setCount(nextCount: number) {
    const clamped = Math.min(max, Math.max(0, nextCount));
    onChange(formatCount(clamped));
  }

  return (
    <div className={cn("space-y-2 text-center", className)}>
      <div>
        <p className="text-sm font-bold text-brand">
          {label}
          {required ? <span className="text-red-500"> *</span> : null}
        </p>
        {hint ? (
          <p className="mt-1 text-[11px] leading-4 text-[#9a9a9a]">{hint}</p>
        ) : null}
      </div>

      <div
        dir="ltr"
        className="flex h-11 w-full items-center justify-center gap-3 rounded-2xl bg-[#f1f7f5] px-1.5"
      >
        <button
          type="button"
          aria-label="decrease"
          disabled={!canDecrease}
          onClick={() => setCount(currentCount - 1)}
          className={cn(
            "inline-flex size-8 shrink-0 items-center justify-center rounded-xl text-white transition-colors",
            canDecrease ? "bg-brand" : "bg-[#c8d6d2]",
          )}
        >
          <Minus className="size-4" />
        </button>

        <span className="min-w-6 text-center text-sm font-bold text-[#1a1a1a]">
          {currentCount}
        </span>

        <button
          type="button"
          aria-label="increase"
          disabled={!canIncrease}
          onClick={() => setCount(currentCount + 1)}
          className={cn(
            "inline-flex size-8 shrink-0 items-center justify-center rounded-xl text-white transition-colors",
            canIncrease ? "bg-brand" : "bg-[#c8d6d2]",
          )}
        >
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  );
}
