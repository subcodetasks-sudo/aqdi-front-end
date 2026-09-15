"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

type AuthBackButtonProps = {
  label: string;
  href?: string;
  className?: string;
  title?: string;
};

export default function AuthBackButton({
  label,
  href = "/",
  className,
  title,
}: AuthBackButtonProps) {
  return (
    <div className="flex items-center gap-2">
      <Link
        href={href}
        aria-label={label}
        className={cn(
          "inline-flex size-10 items-center justify-center rounded-full  bg-gray-600 text-white hover:bg-brand shadow-sm transition-colors ",
          className,
        )}
      >
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
      {title && <span className="text-sm font-medium text-gray-600">{title}</span>}
    </div>
  );
}
