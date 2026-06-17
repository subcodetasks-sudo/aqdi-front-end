"use client";

import { ArrowUpLeft } from "lucide-react";

import CustomIcon from "@/features/shared/components/custom-icon";
import { cn } from "@/lib/utils";

type HeroCtaButtonProps = {
  label: string;
  iconSrc: string;
  featured?: boolean;
};

export default function HeroCtaButton({
  label,
  iconSrc,
  featured = false,
}: HeroCtaButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "group flex h-14 w-full min-w-0 items-center gap-2 rounded-full bg-brand px-2 ps-3 pe-2 text-white transition-colors hover:bg-brand/90 sm:gap-3 sm:ps-4 2xl:ps-5",
        featured &&
          "shadow-[0_0_24px_rgba(13,179,139,0.35)] ring-1 ring-brand-secondary/50"
      )}
    >
      <span className="inline-flex size-6 shrink-0 items-center justify-center sm:size-7">
        <CustomIcon src={iconSrc} size={20} className="text-white" />
      </span>

      <span className="min-w-0 shrink-0 flex-1 text-center text-xs font-semibold leading-tight sm:text-sm">
        {label}
      </span>

      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white ">
        <ArrowUpLeft
          className="size-4 text-brand transition-transform duration-300 group-hover:-rotate-45"
          aria-hidden="true"
        />
      </span>
    </button>
  );
}
