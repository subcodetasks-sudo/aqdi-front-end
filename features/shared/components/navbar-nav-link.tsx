"use client";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpLeft } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type NavbarNavLinkProps = {
  href: string;
  label: string;
  icon: ReactNode;
  external?: boolean;
  isActive?: boolean;
};

export default function NavbarNavLink({
  href,
  label,
  icon,
  external = false,
  isActive,
}: NavbarNavLinkProps) {
  const pathname = usePathname();
  const active = isActive ?? pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 font-bold text-black transition-colors hover:text-brand",
        active ? "text-brand" : ""
      )}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span className="inline-flex size-4 shrink-0 items-center justify-center">
        {icon}
      </span>
      <span className="leading-none">{label}</span>
      {external ? (
        <ArrowUpLeft className="size-4 text-brand-secondary" aria-hidden="true" />
      ) : null}
    </Link>
  );
}
