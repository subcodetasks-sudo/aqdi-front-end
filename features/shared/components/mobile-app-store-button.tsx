import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type MobileAppStoreButtonProps = {
  href: string;
  icon: ReactNode;
  labelTop: string;
  labelBottom: string;
  variant: "google" | "apple";
};

export default function MobileAppStoreButton({
  href,
  icon,
  labelTop,
  labelBottom,
  variant,
}: MobileAppStoreButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex flex-1 items-center gap-3 rounded-2xl px-6 py-2.5 transition-opacity hover:opacity-90",
        variant === "google"
          ? "border border-black/10 bg-[#f3f3f3] text-neutral-800"
          : "bg-black text-white"
      )}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="flex shrink-0 flex-col leading-tight text-left">
        <span className="text-[8px] font-normal">{labelTop}</span>
        <span className="text-sm font-bold">{labelBottom}</span>
      </span>
      <span className="shrink-0">{icon}</span>
    </Link>
  );
}
