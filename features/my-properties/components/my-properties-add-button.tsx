"use client";

import Link from "next/link";
import { Building2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { resetCreatePropertyDraft } from "@/features/create-property/utils/reset-create-property-draft";

type MyPropertiesAddButtonProps = {
  label: string;
};

export default function MyPropertiesAddButton({
  label,
}: MyPropertiesAddButtonProps) {
  return (
    <Button
      type="button"
      className="inline-flex h-12 shrink-0 items-center gap-2 rounded-2xl bg-brand px-5 text-sm font-bold text-white shadow-sm hover:bg-brand/90"
      asChild
    >
      <Link href="/properties/create" onClick={resetCreatePropertyDraft}>
        <Building2 className="size-5" aria-hidden="true" />
        {label}
      </Link>
    </Button>
  );
}
