"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import type { RequestUnitTab } from "@/features/requests/types/request";
import { cn } from "@/lib/utils";

export type RequestTypeFilter =
  | "all"
  | "completed"
  | "draft-contract"
  | "incomplete"
  | "cancelled";

export type RequestsFiltersValue = {
  contractType: RequestUnitTab;
  requestType: RequestTypeFilter;
};

export type RequestsFiltersDialogLabels = {
  title: string;
  close: string;
  contractTypeLabel: string;
  requestTypeLabel: string;
  all: string;
  residential: string;
  commercial: string;
  allTypes: string;
  completed: string;
  draftContract: string;
  incomplete: string;
  cancelled: string;
  showResults: string;
};

type RequestsFiltersDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  labels: RequestsFiltersDialogLabels;
  value: RequestsFiltersValue;
  onApply: (value: RequestsFiltersValue) => void;
};

type FilterPillProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
};

function FilterPill({ label, selected, onClick }: FilterPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-bold transition-colors",
        selected
          ? "border border-brand/35 bg-[#eef8f3] text-brand"
          : "border border-transparent bg-[#f7f7f7] text-[#555555] hover:bg-[#f0f0f0]",
      )}
    >
      {label}
    </button>
  );
}

export default function RequestsFiltersDialog({
  open,
  onOpenChange,
  labels,
  value,
  onApply,
}: RequestsFiltersDialogProps) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    if (open) {
      setDraft(value);
    }
  }, [open, value]);

  function handleApply() {
    onApply(draft);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="gap-0 overflow-hidden rounded-[32px] border-0 bg-white p-0 sm:max-w-lg"
      >
        <div className="flex items-center justify-between gap-3 border-b border-[#ececec] px-5 py-4">
          <DialogTitle className="text-base font-extrabold text-[#1a1a1a] md:text-lg">
            {labels.title}
          </DialogTitle>
          <DialogClose asChild>
            <button
              type="button"
              aria-label={labels.close}
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f2f2f2] text-[#8a8a8a] transition-colors hover:bg-[#ebebeb] hover:text-[#555]"
            >
              <X className="size-4" strokeWidth={2.5} aria-hidden="true" />
            </button>
          </DialogClose>
        </div>

        <div className="space-y-6 px-5 py-5">
          <section className="space-y-3">
            <p className="text-sm font-bold text-[#222]">{labels.contractTypeLabel}</p>
            <div className="flex flex-wrap gap-2">
              <FilterPill
                label={labels.all}
                selected={draft.contractType === "all"}
                onClick={() => setDraft({ ...draft, contractType: "all" })}
              />
              <FilterPill
                label={labels.residential}
                selected={draft.contractType === "residential"}
                onClick={() =>
                  setDraft({ ...draft, contractType: "residential" })
                }
              />
              <FilterPill
                label={labels.commercial}
                selected={draft.contractType === "commercial"}
                onClick={() =>
                  setDraft({ ...draft, contractType: "commercial" })
                }
              />
            </div>
          </section>

          <section className="space-y-3">
            <p className="text-sm font-bold text-[#222]">{labels.requestTypeLabel}</p>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["all", labels.allTypes],
                  ["completed", labels.completed],
                  ["draft-contract", labels.draftContract],
                  ["incomplete", labels.incomplete],
                  ["cancelled", labels.cancelled],
                ] as const
              ).map(([type, label]) => (
                <FilterPill
                  key={type}
                  label={label}
                  selected={draft.requestType === type}
                  onClick={() => setDraft({ ...draft, requestType: type })}
                />
              ))}
            </div>
          </section>
        </div>

        <div className="px-5 pb-5">
          <button
            type="button"
            onClick={handleApply}
            className="flex h-12 w-full items-center justify-center rounded-2xl bg-brand text-sm font-extrabold text-white transition-opacity hover:opacity-90"
          >
            {labels.showResults}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
