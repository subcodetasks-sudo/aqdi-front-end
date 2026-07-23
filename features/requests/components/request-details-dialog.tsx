"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { getUncompletedContract } from "@/features/create-contract/services/get-uncompleted-contract";
import type { RequestDetailsDialogLabels } from "@/features/requests/utils/map-contract-to-request-details";
import {
  mapContractToRequestDetails,
  type RequestDetailsViewModel,
} from "@/features/requests/utils/map-contract-to-request-details";

type RequestDetailsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  uuid: string;
  requestNumber: string;
  labels: RequestDetailsDialogLabels;
  loadErrorLabel: string;
};

export default function RequestDetailsDialog({
  open,
  onOpenChange,
  uuid,
  requestNumber,
  labels,
  loadErrorLabel,
}: RequestDetailsDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [details, setDetails] = useState<RequestDetailsViewModel | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    let cancelled = false;

    async function loadDetails() {
      setIsLoading(true);
      setDetails(null);

      const result = await getUncompletedContract(uuid);

      if (cancelled) {
        return;
      }

      if (!result.ok) {
        toast.error(result.error || loadErrorLabel);
        setIsLoading(false);
        onOpenChange(false);
        return;
      }

      setDetails(mapContractToRequestDetails(result.data, labels));
      setIsLoading(false);
    }

    void loadDetails();

    return () => {
      cancelled = true;
    };
  }, [open, uuid, labels, loadErrorLabel, onOpenChange]);

  const title = labels.title.replace("{number}", requestNumber);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="scrollbar-hide max-h-[min(90vh,760px)] gap-0 overflow-y-auto rounded-[28px] border-0 p-5 sm:max-w-xl md:p-6"
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1.5 text-start">
            <DialogTitle className="text-lg font-extrabold text-[#222222] md:text-xl">
              {title}
            </DialogTitle>
            <DialogDescription className="text-sm leading-6 text-[#8a8a8a]">
              {labels.subtitle}
            </DialogDescription>
          </div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label={labels.close}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f3f3f3] text-[#666666] transition-colors hover:bg-[#ebebeb]"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        {isLoading || !details ? (
          <p className="rounded-2xl bg-[#f7f7f7] px-4 py-10 text-center text-sm font-medium text-[#8a8a8a]">
            {labels.loading}
          </p>
        ) : (
          <div className="space-y-5">
            {details.sections.map((section) => {
              const rows = section.rows.filter((row) => {
                const value = row.value.trim();
                return (
                  value !== "" &&
                  value !== labels.emptyValue &&
                  value !== "-" &&
                  value !== "–" &&
                  value !== "—"
                );
              });

              if (rows.length === 0) {
                return null;
              }

              return (
                <section key={section.title} className="space-y-2">
                  <h3 className="text-sm font-extrabold text-brand">
                    {section.title}
                  </h3>
                  <div className="overflow-hidden rounded-2xl bg-[#f7f7f7]">
                    {rows.map((row, index) => (
                      <div
                        key={`${section.title}-${row.label}`}
                        className={
                          index === 0
                            ? "flex items-center justify-between gap-4 px-4 py-3"
                            : "flex items-center justify-between gap-4 border-t border-[#ececec] px-4 py-3"
                        }
                      >
                        <span className="shrink-0 text-sm text-[#8a8a8a]">
                          {row.label}
                        </span>
                        <span className="min-w-0 text-end text-sm font-bold text-[#222222]">
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
