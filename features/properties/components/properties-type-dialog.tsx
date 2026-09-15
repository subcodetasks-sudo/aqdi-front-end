"use client";

import { X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PropertiesTypeDialogHeader from "@/features/properties/components/properties-type-dialog-header";
import PropertiesTypeDialogOption from "@/features/properties/components/properties-type-dialog-option";
import type { PropertiesTypeDialogLabels } from "@/features/properties/types/properties-type-dialog-labels";
import { PROPERTY_TYPES } from "@/features/properties/types/property-type";

type PropertiesTypeDialogProps = {
  children: React.ReactNode;
  labels: PropertiesTypeDialogLabels;
};

const PROPERTY_TYPE_ICONS = {
  residential: "/icons/housing.svg",
  commercial: "/icons/commercial.svg",
} as const;

export default function PropertiesTypeDialog({
  children,
  labels,
}: PropertiesTypeDialogProps) {
  const [open, setOpen] = useState(false);

  function handleNavigate() {
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="no-scrollbar max-h-[95vh] gap-0 overflow-hidden overflow-y-auto rounded-3xl p-6 sm:max-w-lg sm:p-8 lg:rounded-[50px]"
      >
        <div className="flex items-center justify-between">
          <DialogTitle className="text-base font-semibold text-foreground">
            {labels.title}
          </DialogTitle>

          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-foreground"
              aria-label={labels.close}
            >
              <X className="size-4" aria-hidden="true" />
            </Button>
          </DialogClose>
        </div>

        <div className="mt-6 space-y-5">
          <PropertiesTypeDialogHeader
            mainTitle={labels.mainTitle}
            subtitle={labels.subtitle}
            iconAlt={labels.iconAlt}
          />

          <div className="space-y-3">
            {PROPERTY_TYPES.map((type) => (
              <PropertiesTypeDialogOption
                key={type}
                type={type}
                title={labels.options[type].title}
                description={labels.options[type].description}
                iconSrc={PROPERTY_TYPE_ICONS[type]}
                iconAlt={labels.options[type].iconAlt}
                href={`/properties/create?type=${type}`}
                onNavigate={handleNavigate}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
