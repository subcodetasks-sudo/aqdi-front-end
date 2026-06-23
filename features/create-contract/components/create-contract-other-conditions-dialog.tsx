"use client";

import { ClipboardList, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import CustomIcon from "@/features/shared/components/custom-icon";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import { cn } from "@/lib/utils";

type CreateContractOtherConditionsDialogProps = {
  labels: CreateContractLabels["finance"]["otherConditionsDialog"];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  onSave: (value: string) => void;
};

export default function CreateContractOtherConditionsDialog({
  labels,
  open,
  onOpenChange,
  value,
  onSave,
}: CreateContractOtherConditionsDialogProps) {
  const [draft, setDraft] = useState(value);
  const canSave = draft.trim().length > 0;

  useEffect(() => {
    if (open) {
      setDraft(value);
    }
  }, [open, value]);

  function handleSave() {
    if (!canSave) {
      return;
    }

    onSave(draft.trim());
    onOpenChange(false);
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
            >
              <X className="size-4" aria-hidden="true" />
            </Button>
          </DialogClose>
        </div>

        <div className="mt-6 flex flex-col items-center gap-3 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-brand-secondary shadow-lg shadow-brand-secondary/40">
            <ClipboardList className="size-8 text-white" aria-hidden="true" />
          </div>

          <div className="space-y-2">
            <p className="text-xl font-extrabold leading-relaxed text-brand md:text-2xl">
              {labels.heading}
            </p>
            <p className="text-sm text-[#7f7f7f]">{labels.subtitle}</p>
          </div>
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-semibold text-brand">
            {labels.termsLabel}
          </label>

          <Textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={labels.termsPlaceholder}
            className="min-h-36 rounded-2xl border-[#e8e8e8] bg-brand-background px-4 py-3 text-sm shadow-none focus-visible:border-brand-secondary focus-visible:ring-brand-secondary/20"
          />
        </div>

        <Button
          type="button"
          onClick={handleSave}
          disabled={!canSave}
          className={cn(
            "mt-8 h-12 w-full rounded-xl text-base font-extrabold",
            canSave
              ? "bg-linear-to-br from-brand-secondary via-brand to-brand text-white hover:opacity-90"
              : "bg-white text-[#bdbdbd] shadow-sm",
          )}
        >
          <CustomIcon src="/icons/arrow-r.svg" size={24} />
          {labels.save}
          <CustomIcon src="/icons/arrow-l.svg" size={24} />
        </Button>
      </DialogContent>
    </Dialog>
  );
}
