"use client";

import { Building2, Home } from "lucide-react";

import type { PropertyContractType } from "@/features/create-property/utils/contract-type";
import { cn } from "@/lib/utils";

type CreateUnitContractTypeCardsProps = {
  label: string;
  value: PropertyContractType;
  onChange?: (value: PropertyContractType) => void;
  options: {
    housing: {
      title: string;
      description: string;
    };
    commercial: {
      title: string;
      description: string;
    };
  };
};

export default function CreateUnitContractTypeCards({
  label,
  value,
  onChange,
  options,
}: CreateUnitContractTypeCardsProps) {
  const items = [
    {
      value: "housing" as const,
      title: options.housing.title,
      description: options.housing.description,
      Icon: Home,
    },
    {
      value: "commercial" as const,
      title: options.commercial.title,
      description: options.commercial.description,
      Icon: Building2,
    },
  ];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-black dark:text-white">
        {label}
        <span className="ms-1 text-red-500" aria-hidden="true">
          *
        </span>
      </label>

      <div
        className="grid grid-cols-2 gap-3"
        role="radiogroup"
        aria-label={label}
      >
        {items.map((item) => {
          const selected = value === item.value;
          const Icon = item.Icon;

          return (
            <button
              key={item.value}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={!onChange}
              onClick={() => onChange?.(item.value)}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-2xl border px-3 py-2.5 text-center transition-colors",
                selected
                  ? "border-brand bg-[#eef6f1] dark:border-brand-secondary dark:bg-[#16352f]"
                  : "border-[#e8e8e8] bg-white hover:border-[#d4d4d4] dark:border-[#2f403b] dark:bg-[#121a18] dark:hover:border-[#3a4d47]",
                !onChange && "cursor-default",
              )}
            >
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[#e7f3ec] dark:bg-[#1c2f29]">
                <Icon className="size-4 text-brand" strokeWidth={1.75} aria-hidden="true" />
              </span>

              <span className="space-y-0.5">
                <span className="block text-sm font-bold text-[#1f1f1f] dark:text-white">
                  {item.title}
                </span>
                <span className="block text-[11px] leading-4 text-[#9a9a9a] sm:text-xs sm:leading-4 dark:text-[#9eb5af]">
                  {item.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
