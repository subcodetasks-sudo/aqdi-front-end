import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type UserSheetStoreButtonProps = {
  href: string;
  icon: ReactNode;
  labelTop: string;
  labelBottom: string;
  variant: "google" | "apple";
};

export default function UserSheetStoreButton({
  href,
  icon,
  labelTop,
  labelBottom,
  variant,
}: UserSheetStoreButtonProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex flex-1 items-center justify-center gap-3 rounded-2xl px-4 py-2.5 transition-opacity hover:opacity-90",
        variant === "google"
          ? "border border-black/10 bg-[#f3f3f3] text-neutral-800"
          : "bg-black text-white",
      )}
    >
      <span className="flex shrink-0 flex-col leading-tight text-start">
        <span className="text-[8px] font-normal">{labelTop}</span>
        <span className="text-sm font-bold">{labelBottom}</span>
      </span>
      <span className="shrink-0">{icon}</span>
    </Link>
  );
}
