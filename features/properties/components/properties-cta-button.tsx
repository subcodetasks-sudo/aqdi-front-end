"use client";

import { Button } from "@/components/ui/button";
import CustomIcon from "@/features/shared/components/custom-icon";
import Link from "next/link";

type PropertiesCtaButtonProps = {
  label: string;
};

export default function PropertiesCtaButton({
  label,
}: PropertiesCtaButtonProps) {
  return (
    <Link href="/properties/create">
      <Button
        type="button"
        className="h-12 w-full  rounded-full bg-linear-to-l from-brand-secondary to-brand text-base font-semibold text-white hover:opacity-90"
      >
        <CustomIcon src="/icons/arrow-r.svg" size={30} />
        {label}
        <CustomIcon src="/icons/arrow-l.svg" size={30} />
      </Button>
    </Link>
  );
}
