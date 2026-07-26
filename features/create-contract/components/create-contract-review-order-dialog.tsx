"use client";

import {
  Copy,
  Eye,
  FileText,
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
import {
  reviewEditTargetToStep,
} from "@/features/create-contract/types/create-contract-review-order";
import type { CreateContractStep } from "@/features/create-contract/types/create-contract-step";
import { isSubleaseContract } from "@/features/create-contract/utils/is-sublease-contract";

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
      className={`inline-flex items-center gap-1.5 rounded-full border border-[#e5e5e5] bg-white px-3 py-1.5 text-xs font-bold text-brand shadow-sm transition-colors hover:bg-[#f7f7f7] ${className}`}
    >
      <Pencil className="size-3.5" aria-hidden="true" />
      <span>{label}</span>
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
  const selectedDeedType = useCreateContractDraftStore(
    (state) => state.deed.selectedDeedType,
  );
  const instrumentType = useCreateContractDraftStore(
    (state) => state.contractStep1Data?.instrument_type,
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
    const isSublease = isSubleaseContract({ selectedDeedType, instrumentType });

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
        setTenantPhaseIndex(isSublease ? 0 : 1);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="scrollbar-hide max-h-[min(92vh,900px)] gap-0 overflow-y-auto rounded-[28px] border-0 bg-[#f3f4f6] p-4 sm:max-w-xl md:p-5"
      >
        <div className="relative mb-4 flex items-center justify-center">
          <DialogTitle className="flex items-center justify-center gap-2 text-center text-[15px] font-extrabold text-brand md:text-base">
            <Search className="size-4 shrink-0" aria-hidden="true" />
            <span>{labels.title}</span>
          </DialogTitle>

          <DialogClose asChild>
            <button
              type="button"
              aria-label={labels.close}
              className="absolute start-0 inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-[#9a9a9a] shadow-sm transition-colors hover:bg-[#f0f0f0] hover:text-[#666]"
            >
              <X className="size-4" strokeWidth={2.5} aria-hidden="true" />
            </button>
          </DialogClose>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2.5 shadow-sm">
            <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-[#eef6f3] text-brand">
              <FileText className="size-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] text-[#8a8a8a]">{labels.orderNumber}</p>
              <p className="truncate text-sm font-extrabold text-[#222]">
                {summary.orderNumber}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void handleShare()}
            className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2.5 text-start shadow-sm transition-colors hover:bg-[#fafafa]"
          >
            <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-[#eef6f3] text-brand">
              <Share2 className="size-4" aria-hidden="true" />
            </span>
            <span className="text-sm font-bold text-brand">{labels.share}</span>
          </button>

          <button
            type="button"
            onClick={() => void handleCopy()}
            className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2.5 text-start shadow-sm transition-colors hover:bg-[#fafafa]"
          >
            <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-[#eef6f3] text-brand">
              <Copy className="size-4" aria-hidden="true" />
            </span>
            <span className="text-sm font-bold text-brand">{labels.copy}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2.5 text-start shadow-sm transition-colors hover:bg-[#fafafa]"
          >
            <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-[#eef6f3] text-brand">
              <Printer className="size-4" aria-hidden="true" />
            </span>
            <span className="text-sm font-bold text-brand">{labels.print}</span>
          </button>
        </div>

        <div className="space-y-3">
          <section className="relative rounded-2xl bg-white p-4 shadow-sm">
            <div className="mb-3 flex justify-start">
              <EditButton
                label={labels.edit}
                onClick={() => handleEdit("overview")}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-3">
              <div className="space-y-1 text-center sm:text-start">
                <p className="text-xs text-[#8a8a8a]">
                  {labels.fields.contractType}
                </p>
                <p className="text-sm font-extrabold text-brand">
                  {summary.overview.contractType}
                </p>
              </div>
              <div className="space-y-1 text-center sm:text-start">
                <p className="text-xs text-[#8a8a8a]">
                  {labels.fields.startDate}
                </p>
                <p className="text-sm font-extrabold text-brand">
                  {summary.overview.startDate}
                </p>
              </div>
              <div className="space-y-1 text-center sm:text-start">
                <p className="text-xs text-[#8a8a8a]">
                  {labels.fields.duration}
                </p>
                <p className="text-sm font-extrabold text-brand">
                  {summary.overview.duration}
                </p>
              </div>
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
                    className="absolute start-3 top-3 border-0 bg-white/15 text-white hover:bg-white/25"
                  />
                  <div className="space-y-2 pt-8 text-center">
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

            const isUnit = section.id === "unit";

            return (
              <section
                key={section.id}
                className="relative rounded-2xl bg-white p-4 shadow-sm"
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

                <div
                  className={
                    isUnit
                      ? "grid grid-cols-1 gap-3 sm:grid-cols-2"
                      : "space-y-3"
                  }
                >
                  {section.fields.map((field) => (
                    <div
                      key={`${section.id}-${field.label}`}
                      className="flex items-start justify-between gap-3"
                    >
                      <div className="min-w-0 space-y-0.5">
                        <p className="text-xs text-[#8a8a8a]">{field.label}</p>
                        {field.href ? (
                          <a
                            href={field.href}
                            target="_blank"
                            rel="noreferrer"
                            className="block break-all text-sm font-bold text-brand underline-offset-2 hover:underline"
                          >
                            {field.value}
                          </a>
                        ) : (
                          <p className="break-words text-sm font-bold text-[#222]">
                            {field.value}
                          </p>
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
          className="mt-3 flex h-12 w-full items-center justify-center rounded-full bg-brand px-4 text-sm font-extrabold text-white transition-opacity hover:opacity-90"
        >
          {labels.confirm}
        </button>
      </DialogContent>
    </Dialog>
  );
}
