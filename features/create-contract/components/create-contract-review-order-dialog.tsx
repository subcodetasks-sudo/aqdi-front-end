"use client";

import {
  ClipboardList,
  Copy,
  Eye,
  Pencil,
  Printer,
  Search,
  Share2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { useContractReviewOrderSummary } from "@/features/create-contract/hooks/use-contract-review-order-summary";
import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import type { ContractTypeId } from "@/features/create-contract/types/contract-type";
import type { DeedTypeId } from "@/features/create-contract/types/deed-type";
import type { CreateContractReviewEditTarget } from "@/features/create-contract/types/create-contract-review-order";
import { reviewEditTargetToStep } from "@/features/create-contract/types/create-contract-review-order";
import type { CreateContractStep } from "@/features/create-contract/types/create-contract-step";
import { cn } from "@/lib/utils";

type CreateContractReviewOrderDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  labels: CreateContractLabels["payment"]["reviewDialog"];
  contractType: ContractTypeId;
  deedTypeLabels: Record<DeedTypeId, string>;
  deedAttachmentLabels: {
    label: string;
    salePaperLabel?: string;
  };
  onEditStep: (step: CreateContractStep) => void;
};

function openAttachment(viewUrl: string | null | undefined) {
  if (!viewUrl) {
    return;
  }

  if (viewUrl === "local:deed") {
    const deed = useCreateContractDraftStore.getState().deed;
    const file = deed.deedFiles[0] ?? deed.deedFrontFiles[0];
    if (!file) {
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    window.open(objectUrl, "_blank", "noopener,noreferrer");
    return;
  }

  if (viewUrl === "local:address-photo") {
    const file =
      useCreateContractDraftStore.getState().deed.nationalAddressPhotoFiles[0];
    if (!file) {
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    window.open(objectUrl, "_blank", "noopener,noreferrer");
    return;
  }

  window.open(viewUrl, "_blank", "noopener,noreferrer");
}

function EditButton({
  label,
  onClick,
  className = "",
}: {
  label: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-[#e5e5e5] bg-white px-3 py-1.5 text-xs font-bold text-brand shadow-sm transition-colors hover:bg-[#f7f7f7]",
        className,
      )}
    >
      <Pencil className="size-3.5" aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}

function OverviewEditIcon({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className=" inline-flex  items-center justify-center rounded-lg  cursor-pointer"
    >
      <Pencil className="size-3.5" aria-hidden="true" />
    </button>
  );
}

export default function CreateContractReviewOrderDialog({
  open,
  onOpenChange,
  labels,
  contractType,
  deedTypeLabels,
  deedAttachmentLabels,
  onEditStep,
}: CreateContractReviewOrderDialogProps) {
  const summary = useContractReviewOrderSummary(
    labels,
    contractType,
    deedTypeLabels,
    deedAttachmentLabels,
  );
  const setDeedPhaseIndex = useCreateContractDraftStore(
    (state) => state.setDeedPhaseIndex,
  );
  const setOwnerPhaseIndex = useCreateContractDraftStore(
    (state) => state.setOwnerPhaseIndex,
  );
  const setTenantPhaseIndex = useCreateContractDraftStore(
    (state) => state.setTenantPhaseIndex,
  );

  function handleEdit(target: CreateContractReviewEditTarget) {
    switch (target) {
      case "deed":
        setDeedPhaseIndex(0);
        break;
      case "nationalAddress":
        setDeedPhaseIndex(1);
        break;
      case "owner":
        setOwnerPhaseIndex(0);
        break;
      case "tenant":
        setTenantPhaseIndex(0);
        break;
      case "unit":
        setTenantPhaseIndex(1);
        break;
      default:
        break;
    }

    onOpenChange(false);
    onEditStep(reviewEditTargetToStep(target));
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(summary.copyText);
      toast.success(labels.copySuccess);
    } catch {
      toast.error(labels.copyError);
    }
  }

  async function handleShare() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: labels.title,
          text: summary.copyText,
        });
        return;
      }

      await navigator.clipboard.writeText(summary.copyText);
      toast.success(labels.copySuccess);
    } catch {
      toast.error(labels.shareError);
    }
  }

  function handlePrint() {
    window.print();
  }

  const overviewItems = [
    {
      key: "contractType",
      label: labels.fields.contractType,
      value: summary.overview.contractType,
      editable: false,
    },
    {
      key: "startDate",
      label: labels.fields.startDate,
      value: summary.overview.startDate,
      editable: true,
    },
    {
      key: "duration",
      label: labels.fields.duration,
      value: summary.overview.duration,
      editable: true,
    },
  ] as const;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="scrollbar-hide max-h-[min(92vh,900px)] gap-0 overflow-y-auto rounded-2xl border-0 bg-white p-4 sm:max-w-xl md:p-5"
      >
        <div className="relative mb-4 flex items-center justify-between">
          <DialogTitle className="flex items-center justify-center gap-2 text-center text-[15px] font-extrabold text-brand md:text-base">
            <Search className="size-4 shrink-0" aria-hidden="true" />
            <span>{labels.title}</span>
          </DialogTitle>

          <DialogClose asChild>
            <button
              type="button"
              aria-label={labels.close}
              className=" inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-[#9a9a9a] shadow-sm transition-colors hover:bg-[#f0f0f0] hover:text-[#666]"
            >
              <X className="size-4" strokeWidth={2.5} aria-hidden="true" />
            </button>
          </DialogClose>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4  border-b pb-4">
          <div className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-[#dce8e3] bg-[#eef6f3] px-2 py-3 text-center">
            <p className="text-lg font-extrabold leading-none text-brand md:text-xl">
              {summary.orderNumber}
            </p>
            <p className="inline-flex items-center gap-1 text-[11px] font-medium text-[#6b7c76]">
              <ClipboardList className="size-3" aria-hidden="true" />
              <span>{labels.orderNumber}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => void handleShare()}
            className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-[#e8e8e8] bg-white px-2 py-3 text-brand transition-colors hover:bg-[#fafafa]"
          >
            <Share2 className="size-4" aria-hidden="true" />
            <span className="text-xs font-bold">{labels.share}</span>
          </button>

          <button
            type="button"
            onClick={() => void handleCopy()}
            className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-[#e8e8e8] bg-white px-2 py-3 text-brand transition-colors hover:bg-[#fafafa]"
          >
            <Copy className="size-4" aria-hidden="true" />
            <span className="text-xs font-bold">{labels.copy}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-[#e8e8e8] bg-white px-2 py-3 text-brand transition-colors hover:bg-[#fafafa]"
          >
            <Printer className="size-4" aria-hidden="true" />
            <span className="text-xs font-bold">{labels.print}</span>
          </button>
        </div>

        <div className="space-y-3">
          <section className="rounded-lg border border-[#cfe8dd] bg-[#f5fbf8] p-3 shadow-sm">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {overviewItems.map((item) => (
                <div
                  key={item.key}
                  className="relative flex  flex-col items-start rounded-lg border border-[#dfe7e3] bg-white px-4 py-3 text-start shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                >
                  {item.editable ? (
                    <div className="absolute inset-e-3 top-3">
                    <OverviewEditIcon
                        label={`${labels.edit} ${item.label}`}
                        onClick={() => handleEdit("overview")}
                      />
                    </div>
                  ) :null}
                  <p className="mb-1 text-xs font-bold text-[#8a8a8a]">
                    {item.label}
                  </p>
                  <p className="text-sm font-extrabold leading-tight text-brand">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {summary.sections.map((section) => {
            if (section.variant === "rent") {
              const amountField = section.fields[1];
              const paymentMethodField = section.fields[0];
              const amount = amountField?.value ?? labels.emptyValue;
              const paymentMethod =
                paymentMethodField?.value ?? labels.emptyValue;

              return (
                <section
                  key={section.id}
                  className="relative overflow-hidden rounded-2xl bg-brand px-4 py-5 text-white shadow-sm"
                >
                  <EditButton
                    label={labels.edit}
                    onClick={() => handleEdit(section.editTarget)}
                    className="absolute inset-e-3 top-3 border-white/20 bg-white/15 text-white hover:bg-white/25"
                  />
                  <div className="space-y-2  text-start">
                    <p className="text-sm font-bold opacity-90">
                      {section.title}
                    </p>
                    <p className="text-2xl font-extrabold tracking-tight md:text-3xl">
                      {amount}
                    </p>
                    <p className="text-sm font-medium opacity-90">
                      {paymentMethod}
                    </p>
                  </div>
                </section>
              );
            }

            return (
              <section
                key={section.id}
                className="relative rounded-2xl border border-[#ececec] bg-gray-200/10 p-4 shadow-sm"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h3 className="text-sm font-extrabold text-brand">
                    {section.title}
                  </h3>
                  <EditButton
                    label={labels.edit}
                    onClick={() => handleEdit(section.editTarget)}
                  />
                </div>

                {section.incomplete ? (
                  <p className="text-sm font-medium text-[#e11d48]">
                    {labels.unitIncomplete}
                  </p>
                ) : (
                  <div className="divide-y divide-dashed divide-[#e5e5e5]">
                    {section.fields.map((field) => (
                      <div
                        key={`${section.id}-${field.label}`}
                        className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0"
                      >
                        <div className="min-w-0 text-sm">
                          <span className="font-medium text-[#8a8a8a]">
                            {field.label}:{" "}
                          </span>
                          {field.href ? (
                            <a
                              href={field.href}
                              target="_blank"
                              rel="noreferrer"
                              className="break-all font-bold text-brand underline-offset-2 hover:underline"
                            >
                              {field.value}
                            </a>
                          ) : (
                            <span className="wrap-break-word font-bold text-[#222]">
                              {field.value}
                            </span>
                          )}
                        </div>

                        {field.viewUrl ? (
                          <button
                            type="button"
                            onClick={() => openAttachment(field.viewUrl)}
                            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#eef6f3] px-3 py-1.5 text-xs font-bold text-brand transition-colors hover:bg-[#e3f0eb]"
                          >
                            <Eye className="size-3.5" aria-hidden="true" />
                            <span>{labels.view}</span>
                          </button>
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>

        <p className="mt-4 text-center text-xs leading-5 text-[#8a8a8a]">
          {labels.hint}
        </p>

        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="mt-3 flex h-12 w-full items-center justify-center rounded-2xl bg-brand px-4 text-sm font-extrabold text-white transition-opacity hover:opacity-90"
        >
          {labels.confirm}
        </button>
      </DialogContent>
    </Dialog>
  );
}
