"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { MY_PROPERTY_DEED_IMAGE } from "@/features/my-properties/data/my-property-deed-config";

type MyPropertyDeedDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function MyPropertyDeedDialog({
  open,
  onOpenChange,
}: MyPropertyDeedDialogProps) {
  const t = useTranslations("myProperties.card.deedDialog");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="gap-0 overflow-hidden rounded-[32px] p-6 sm:max-w-md"
      >
        <div className="flex items-start justify-between gap-4">
          <DialogTitle className="text-base font-extrabold text-brand">
            {t("title")}
          </DialogTitle>

          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="shrink-0 text-foreground hover:bg-muted"
              aria-label={t("close")}
            >
              <X className="size-4" aria-hidden="true" />
            </Button>
          </DialogClose>
        </div>

        <div className="mt-5  rounded-2xl bg-white">
          <Image
            src={MY_PROPERTY_DEED_IMAGE}
            alt={t("imageAlt")}
            width={350}
            height={450}
            className="h-auto w-full object-cover rounded-2xl"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
