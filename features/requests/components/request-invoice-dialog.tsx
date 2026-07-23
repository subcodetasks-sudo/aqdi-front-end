"use client";

import { Printer, X } from "lucide-react";
import { useLocale } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { getContractInvoice } from "@/features/requests/services/get-contract-invoice";
import type { ContractInvoice } from "@/features/requests/types/contract-invoice";
import type { RequestInvoiceDialogLabels } from "@/features/requests/types/request-invoice-labels";

type RequestInvoiceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contractId: number;
  uuid: string;
  contractTypeLabel: string;
  labels: RequestInvoiceDialogLabels;
};

export default function RequestInvoiceDialog({
  open,
  onOpenChange,
  contractId,
  uuid,
  contractTypeLabel,
  labels,
}: RequestInvoiceDialogProps) {
  const locale = useLocale();
  const printRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invoice, setInvoice] = useState<ContractInvoice | null>(null);

  const chrome = {
    title: labels.title,
    platformName: labels.platformName,
    platformSubtitle: labels.platformSubtitle,
    printLabel: labels.printLabel,
    totalDueLabel: labels.totalDueLabel,
    unpaidStatusLabel: labels.unpaidStatusLabel,
    paidStatusLabel: labels.paidStatusLabel,
  };

  const loadInvoice = useCallback(
    async (signal?: { cancelled: boolean }) => {
      setIsLoading(true);
      setError(null);
      setInvoice(null);

      try {
        const result = await getContractInvoice({
          contractId,
          uuid,
          contractTypeLabel,
          locale,
          chrome,
        });

        if (signal?.cancelled) {
          return;
        }

        if (!result.ok) {
          setError(result.error || labels.loadError);
          setInvoice(null);
          return;
        }

        setInvoice(result.data);
        setError(null);
      } catch {
        if (!signal?.cancelled) {
          setError(labels.loadError);
          setInvoice(null);
        }
      } finally {
        if (!signal?.cancelled) {
          setIsLoading(false);
        }
      }
    },
    // chrome fields are stable strings from server-rendered labels
    // eslint-disable-next-line react-hooks/exhaustive-deps -- avoid re-fetch on new labels object identity
    [
      contractId,
      uuid,
      contractTypeLabel,
      locale,
      labels.loadError,
      labels.title,
      labels.platformName,
      labels.platformSubtitle,
      labels.printLabel,
      labels.totalDueLabel,
      labels.unpaidStatusLabel,
      labels.paidStatusLabel,
    ],
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    const signal = { cancelled: false };
    void loadInvoice(signal);

    return () => {
      signal.cancelled = true;
    };
  }, [open, loadInvoice]);

  function handlePrint() {
    const content = printRef.current;
    if (!content || !invoice) {
      return;
    }

    const printWindow = window.open(
      "",
      "_blank",
      "noopener,noreferrer,width=840,height=900",
    );

    if (!printWindow) {
      toast.error(labels.loadError);
      return;
    }

    const title = invoice.title || invoice.invoice_number || "invoice";

    printWindow.document.write(`<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
    <style>
      body { font-family: Tahoma, Arial, sans-serif; padding: 24px; color: #222; }
      * { box-sizing: border-box; }
    </style>
  </head>
  <body>${content.innerHTML}</body>
</html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }

  const statusColor = invoice?.status_color || "#2f9e6f";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="scrollbar-hide max-h-[min(90vh,820px)] gap-0 overflow-y-auto rounded-[28px] border-0 p-5 sm:max-w-xl md:p-6"
      >
        <div className="mb-4 flex items-center justify-between gap-3 border-b border-[#ececec] pb-4">
          <DialogTitle className="text-lg font-extrabold text-[#222222] md:text-xl">
            {invoice?.title || labels.title}
          </DialogTitle>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label={labels.close}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f3f3f3] text-[#666666] transition-colors hover:bg-[#ebebeb]"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        {isLoading && !invoice ? (
          <p className="rounded-2xl bg-[#f7f7f7] px-4 py-10 text-center text-sm font-medium text-[#8a8a8a]">
            {labels.loading}
          </p>
        ) : null}

        {error && !invoice ? (
          <div className="space-y-3 rounded-2xl bg-[#fff5f5] px-4 py-5 text-center">
            <p className="text-sm text-[#c0392b]">{error}</p>
            <button
              type="button"
              onClick={() => void loadInvoice()}
              className="inline-flex h-10 items-center justify-center rounded-2xl bg-brand px-4 text-sm font-bold text-white"
            >
              {labels.retry}
            </button>
          </div>
        ) : null}

        {invoice ? (
          <>
            <div
              ref={printRef}
              className="rounded-[24px] border border-[#ececec] bg-white p-4 md:p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 text-start">
                  {invoice.platform_name ? (
                    <p className="text-xl font-extrabold text-brand">
                      {invoice.platform_name}
                    </p>
                  ) : null}
                  {invoice.platform_subtitle ? (
                    <p className="mt-1 text-xs text-[#8a8a8a]">
                      {invoice.platform_subtitle}
                    </p>
                  ) : null}
                </div>
                <div className="space-y-1 text-start text-xs text-[#8a8a8a] md:text-end">
                  {invoice.invoice_number ? (
                    <p>{invoice.invoice_number}</p>
                  ) : null}
                  {invoice.datetime_label ? (
                    <p>{invoice.datetime_label}</p>
                  ) : null}
                  {invoice.reference_number ? (
                    <p>{invoice.reference_number}</p>
                  ) : null}
                </div>
              </div>

              <div className="mt-4 grid gap-3 rounded-2xl bg-[#f7f7f7] px-4 py-3 sm:grid-cols-3">
                {invoice.customer_name ? (
                  <div className="min-w-0 space-y-1 text-start">
                    <p className="text-xs text-[#8a8a8a]">
                      {labels.customerLabel}
                    </p>
                    <p className="truncate text-sm font-bold text-[#222222]">
                      {invoice.customer_name}
                    </p>
                  </div>
                ) : null}
                <div className="min-w-0 space-y-1 text-start">
                  <p className="text-xs text-[#8a8a8a]">
                    {labels.requestNumberLabel}
                  </p>
                  <p className="text-sm font-bold text-[#222222]">
                    {invoice.order_number}
                  </p>
                </div>
                {invoice.contract_type_label ? (
                  <div className="min-w-0 space-y-1 text-start">
                    <p className="text-xs text-[#8a8a8a]">
                      {labels.contractTypeLabel}
                    </p>
                    <p className="text-sm font-bold text-[#222222]">
                      {invoice.contract_type_label}
                    </p>
                  </div>
                ) : null}
              </div>

              {invoice.items.length > 0 ? (
                <div className="mt-4 overflow-hidden rounded-2xl border border-[#ececec]">
                  <div className="grid grid-cols-[48px_1fr_auto] gap-3 bg-brand px-4 py-2.5 text-xs font-bold text-white">
                    <span>{labels.tableIndex}</span>
                    <span>{labels.tableDescription}</span>
                    <span>{labels.tableAmount}</span>
                  </div>
                  {invoice.items.map((item) => (
                    <div
                      key={`${item.index}-${item.description}`}
                      className="grid grid-cols-[48px_1fr_auto] gap-3 border-t border-[#f0f0f0] px-4 py-3 text-sm first:border-t-0"
                    >
                      <span className="font-bold text-[#222222]">
                        {item.index}
                      </span>
                      <span className="font-medium text-[#333333]">
                        {item.description}
                      </span>
                      <span className="font-bold text-[#222222]">
                        {item.amount_label}
                      </span>
                    </div>
                  ))}
                </div>
              ) : null}

              {invoice.total_due_label || invoice.total_amount_label ? (
                <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl bg-[#f7f7f7] px-4 py-3">
                  <span className="text-sm font-bold text-[#555555]">
                    {invoice.total_due_label}
                  </span>
                  <span className="text-sm font-extrabold text-brand">
                    {invoice.total_amount_label}
                  </span>
                </div>
              ) : null}

              {invoice.status_label ? (
                <div className="mt-4 flex justify-center">
                  <span
                    className="inline-flex items-center rounded-full border px-3.5 py-1.5 text-xs font-bold"
                    style={{
                      color: statusColor,
                      borderColor: statusColor,
                      backgroundColor: `${statusColor}14`,
                    }}
                  >
                    {invoice.status_label}
                  </span>
                </div>
              ) : null}
            </div>

            {invoice.print_label ? (
              <button
                type="button"
                onClick={handlePrint}
                className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-brand-background-green px-4 text-sm font-bold text-brand transition-opacity hover:opacity-90"
              >
                <Printer className="size-4 shrink-0" aria-hidden="true" />
                {invoice.print_label}
              </button>
            ) : null}
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
