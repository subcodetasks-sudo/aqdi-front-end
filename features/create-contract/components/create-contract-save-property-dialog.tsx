"use client";

import { Building2, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import CustomIcon from "@/features/shared/components/custom-icon";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import { cn } from "@/lib/utils";

type CreateContractSavePropertyDialogProps = {
  labels: CreateContractLabels["payment"]["savePropertyData"]["dialog"];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValue?: string;
  isSaving?: boolean;
  onSave: (propertyName: string) => void | Promise<void>;
};

export default function CreateContractSavePropertyDialog({
  labels,
  open,
  onOpenChange,
  initialValue = "",
  isSaving = false,
  onSave,
}: CreateContractSavePropertyDialogProps) {
  const [propertyName, setPropertyName] = useState(initialValue);
  const canSave = propertyName.trim().length > 0 && !isSaving;

  useEffect(() => {
    if (open) {
      setPropertyName(initialValue);
    }
  }, [initialValue, open]);

  async function handleSave() {
    if (!canSave) {
      return;
    }

    await onSave(propertyName.trim());
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="gap-0 overflow-hidden rounded-3xl p-6 sm:max-w-md"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#ececec] pb-4">
          <DialogTitle className="text-base font-bold leading-snug text-[#333333]">
            {labels.title}
          </DialogTitle>

          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="shrink-0 text-[#999999] hover:bg-brand-background hover:text-[#666666]"
              aria-label={labels.close}
              disabled={isSaving}
            >
              <X className="size-4" aria-hidden="true" />
            </Button>
          </DialogClose>
        </div>

        <div className="mt-6 flex flex-col items-center gap-3 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-brand-secondary shadow-lg shadow-brand-secondary/40">
            <Building2 className="size-8 text-white" aria-hidden="true" />
          </div>

          <div className="space-y-2">
            <p className="text-xl font-extrabold leading-relaxed text-brand md:text-2xl">
              {labels.heading}
            </p>
            <p className="text-sm text-[#7f7f7f]">{labels.subtitle}</p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <label className="block text-sm font-semibold text-brand">
            {labels.nameLabel}
          </label>

          <div className="flex h-14 w-full items-center gap-2 rounded-full border border-[#e8e8e8] bg-brand-background px-2">
            <span className="inline-flex size-10 shrink-0 items-center justify-center text-brand-secondary">
              <Building2 className="size-5" aria-hidden="true" />
            </span>

            <span className="h-6 w-px shrink-0 bg-[#dcdcdc]" aria-hidden="true" />

            <Input
              type="text"
              value={propertyName}
              onChange={(event) => setPropertyName(event.target.value)}
              placeholder={labels.namePlaceholder}
              disabled={isSaving}
              className="h-auto border-0 bg-transparent px-2 text-sm shadow-none focus-visible:ring-0"
            />
          </div>

          <div className="space-y-1">
            <p className="flex items-start gap-1.5 text-sm text-[#333333]">
              <CustomIcon
                src="/icons/like.svg"
                size={18}
                className="mt-0.5 shrink-0 text-red-400"
              />
              <span>{labels.nameHint}</span>
            </p>
            <p className="text-xs text-[#bdbdbd]">{labels.nameExample}</p>
          </div>
        </div>

        <Button
          type="button"
          onClick={() => void handleSave()}
          disabled={!canSave}
          className={cn(
            "mt-8 h-12 w-full rounded-xl text-base font-extrabold",
            canSave
              ? "bg-linear-to-br from-brand-secondary via-brand to-brand text-white hover:opacity-90"
              : "bg-white text-[#bdbdbd] shadow-sm",
          )}
        >
          <CustomIcon src="/icons/arrow-r.svg" size={24} />
          {isSaving ? labels.saving : labels.save}
          <CustomIcon src="/icons/arrow-l.svg" size={24} />
        </Button>
      </DialogContent>
    </Dialog>
  );
}
