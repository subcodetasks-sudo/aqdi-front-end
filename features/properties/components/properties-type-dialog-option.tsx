"use client";

import { ArrowUpLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import CustomIcon from "@/features/shared/components/custom-icon";
import type { PropertyTypeId } from "@/features/properties/types/property-type";
import { cn } from "@/lib/utils";

type PropertiesTypeDialogOptionProps = {
  type: PropertyTypeId;
  title: string;
  description: string;
  iconSrc: string;
  iconAlt: string;
  href: string;
  onNavigate: () => void;
};

export default function PropertiesTypeDialogOption({
  type,
  title,
  description,
  iconSrc,
  iconAlt,
  href,
  onNavigate,
}: PropertiesTypeDialogOptionProps) {
  const router = useRouter();

  function handleClick() {
    onNavigate();
    router.push(href);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "group flex w-full items-center gap-3 rounded-full px-3 py-3 text-start transition-opacity hover:opacity-90 sm:gap-4 sm:px-4 sm:py-3.5",
        type === "residential"
          ? "bg-brand-background-green"
          : "bg-[#eef3f8]",
      )}
    >

<span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-white sm:size-12">
        <CustomIcon src={iconSrc} size={22} />
        <span className="sr-only">{iconAlt}</span>
      </span>
      <span className="min-w-0 flex-1 space-y-0.5">
        <span className="block text-sm font-bold text-foreground sm:text-base">
          {title}
        </span>
        <span className="block text-xs leading-relaxed text-muted-foreground sm:text-sm">
          {description}
        </span>
      </span>


      <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-white sm:size-9">
        <ArrowUpLeft
          className="size-4 text-brand transition-transform duration-300 group-hover:-rotate-45"
          aria-hidden="true"
        />
      </span>
    </button>
  );
}
