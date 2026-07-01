"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { resetCreatePropertyDraft } from "@/features/create-property/utils/reset-create-property-draft";
import CustomIcon from "@/features/shared/components/custom-icon";

type PropertiesCtaButtonProps = {
  label: string;
  className?: string;
};

export default function PropertiesCtaButton({
  label,
  className,
}: PropertiesCtaButtonProps) {
  return (
    <Button
      asChild
      className={
        className ??
        "h-12 w-full rounded-full bg-linear-to-l from-brand-secondary to-brand text-base font-semibold text-white hover:opacity-90"
      }
    >
      <Link href="/properties/create" onClick={resetCreatePropertyDraft}>
        <CustomIcon src="/icons/arrow-r.svg" size={30} />
        {label}
        <CustomIcon src="/icons/arrow-l.svg" size={30} />
      </Link>
    </Button>
  );
}
