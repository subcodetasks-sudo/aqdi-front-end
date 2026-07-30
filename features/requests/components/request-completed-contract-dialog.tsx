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
import { getCompletedContractDetails } from "@/features/requests/services/get-completed-contract-details";
import {
  mapCompletedContractToDetails,
  type RequestContractDetailsViewModel,
  type RequestContractDialogLabels,
} from "@/features/requests/utils/map-completed-contract-to-details";

type RequestCompletedContractDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contractId: number;
  uuid: string;
  requestNumber: string;
  labels: RequestContractDialogLabels;
  loadErrorLabel: string;
};

export default function RequestCompletedContractDialog({
  open,
  onOpenChange,
  contractId,
  uuid,
  requestNumber,
  labels,
  loadErrorLabel,
}: RequestCompletedContractDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [details, setDetails] = useState<RequestContractDetailsViewModel | null>(
    null,
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    let cancelled = false;

    async function loadDetails() {
      setIsLoading(true);
      setDetails(null);

      const result = await getCompletedContractDetails(contractId, uuid);

      if (cancelled) {
        return;
      }

      if (!result.ok) {
        toast.error(result.error || loadErrorLabel);
        setIsLoading(false);
        onOpenChange(false);
        return;
      }

      setDetails(mapCompletedContractToDetails(result.data, labels));
      setIsLoading(false);
    }

    void loadDetails();

    return () => {
      cancelled = true;
    };
  }, [open, contractId, uuid, labels, loadErrorLabel, onOpenChange]);

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
            {details.sections.map((section) => (
              <section key={section.title} className="space-y-2">
                <h3 className="text-sm font-extrabold text-brand">
                  {section.title}
                </h3>
                <div className="overflow-hidden rounded-2xl bg-[#f7f7f7]">
                  {section.rows.map((row, index) => (
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
                      {row.href ? (
                        <a
                          href={row.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="min-w-0 text-end text-sm font-bold text-brand underline underline-offset-2 hover:opacity-80"
                        >
                          {row.value}
                        </a>
                      ) : (
                        <span className="min-w-0 text-end text-sm font-bold text-[#222222]">
                          {row.value}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
