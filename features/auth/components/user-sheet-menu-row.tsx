"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";

import { cn } from "@/lib/utils";

type UserSheetMenuRowProps = {
  label: string;
  icon: ReactNode;
  href?: string;
  onClick?: () => void;
  trailing?: ReactNode;
  external?: boolean;
  className?: string;
};

export default function UserSheetMenuRow({
  label,
  icon,
  href,
  onClick,
  trailing,
  external = false,
  className,
}: UserSheetMenuRowProps) {
  const rowClassName = cn(
    "flex w-full items-center gap-3 text-start transition-colors hover:text-brand",
    className,
  );

  const content = (
    <>
      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-border/60 bg-white text-brand">
        {icon}
      </span>
      <span className="flex-1 text-sm font-bold text-foreground">{label}</span>
      {trailing ?? (
        <ChevronLeft
          className="size-5 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
      )}
    </>
  );

  if (trailing) {
    return <div className={rowClassName}>{content}</div>;
  }

  if (href) {
    return (
      <Link
        href={href}
        className={rowClassName}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={rowClassName}>
      {content}
    </button>
  );
}
