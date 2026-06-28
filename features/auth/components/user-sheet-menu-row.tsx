"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronLeft, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

type UserSheetMenuRowProps = {
  label: string;
  icon: ReactNode;
  href?: string;
  onClick?: () => void;
  trailing?: ReactNode;
  external?: boolean;
  className?: string;
  isLoading?: boolean;
  disabled?: boolean;
};

export default function UserSheetMenuRow({
  label,
  icon,
  href,
  onClick,
  trailing,
  external = false,
  className,
  isLoading = false,
  disabled = false,
}: UserSheetMenuRowProps) {
  const isDisabled = disabled || isLoading;

  const rowClassName = cn(
    "flex w-full items-center gap-3 text-start transition-colors hover:text-brand",
    isDisabled && "pointer-events-none opacity-60",
    className,
  );

  const content = (
    <>
      <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-brand">
        {icon}
      </span>
      <span className="flex-1 text-sm font-bold text-foreground">{label}</span>
      {trailing ??
        (isLoading ? (
          <Loader2
            className="size-5 shrink-0 animate-spin text-muted-foreground"
            aria-hidden="true"
          />
        ) : (
          <ChevronLeft
            className="size-5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
        ))}
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
        aria-disabled={isDisabled}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className={rowClassName}
    >
      {content}
    </button>
  );
}