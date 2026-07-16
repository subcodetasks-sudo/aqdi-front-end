"use client";

import { SheetClose, SheetTitle } from "@/components/ui/sheet";
import { X } from "lucide-react";

type UserSheetHeaderProps = {
  title: string;
  closeLabel: string;
};

export default function UserSheetHeader({
  title,
  closeLabel,
}: UserSheetHeaderProps) {
  return (
    <div className="flex items-center justify-between pb-4">
      <SheetTitle className="text-lg font-bold text-foreground">
        {title}
      </SheetTitle>
      <SheetClose
        className="inline-flex size-8 items-center justify-center rounded-full text-foreground transition-colors hover:text-brand"
        aria-label={closeLabel}
      >
        <X className="size-5" aria-hidden="true" />
      </SheetClose>
    </div>
  );
}
