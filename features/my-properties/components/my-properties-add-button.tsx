"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import CustomIcon from "@/features/shared/components/custom-icon";

type MyPropertiesAddButtonProps = {
  label: string;
};

export default function MyPropertiesAddButton({
  label,
}: MyPropertiesAddButtonProps) {
  return (
    <Button
      type="button"
      className="flex h-14 w-full max-w-xl items-center justify-between rounded-full bg-linear-to-l from-brand-secondary to-brand px-4 text-base font-bold text-white hover:opacity-90"
      asChild
    >
      <Link href="/properties/create" className="flex items-center justify-center gap-2">
        <CustomIcon src="/icons/arrow-r.svg" size={28} />
        {label}
        <CustomIcon src="/icons/arrow-l.svg" size={28} />
      </Link>
    </Button>
  );
}
