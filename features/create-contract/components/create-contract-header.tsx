"use client";

import { Copy, Home } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { FaWhatsapp } from "react-icons/fa";

import CreateContractExitHomeDialog from "@/features/create-contract/components/create-contract-exit-home-dialog";
import { useSaveContractDraft } from "@/features/create-contract/hooks/use-save-contract-draft";
import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import { resetCreateContractDraft } from "@/features/create-contract/utils/reset-create-contract-draft";
import { cn } from "@/lib/utils";

type CreateContractHeaderProps = {
  pageTitle: string;
  labels: CreateContractLabels["header"];
};

const pillBaseClassName =
  "inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-bold transition-colors";

export default function CreateContractHeader({
  pageTitle,
  labels,
}: CreateContractHeaderProps) {
  const router = useRouter();
  const { saveDraft, isSaving } = useSaveContractDraft();
  const [exitDialogOpen, setExitDialogOpen] = useState(false);
  const contractId = useCreateContractDraftStore(
    (state) =>
      state.contractSession?.contractId ??
      state.contractStep1Data?.contract_id ??
      null,
  );

  async function handleCopyRequest() {
    if (!contractId) {
      return;
    }

    const text = `${labels.requestPrefix} #${contractId}`;

    try {
      await navigator.clipboard.writeText(text);
      toast.success(labels.copySuccess);
    } catch {
      toast.error(labels.copyError);
    }
  }

  function handleHomeClick() {
    if (!contractId) {
      router.push("/");
      return;
    }

    setExitDialogOpen(true);
  }

  async function handleSaveThenExit() {
    const result = await saveDraft();

    if (!result.ok) {
      toast.error(
        result.error === "missingContractSession"
          ? labels.exitHomeDialog.missingContractSession
          : result.error || labels.exitHomeDialog.saveError,
      );
      return;
    }

    setExitDialogOpen(false);
    resetCreateContractDraft();
    router.push("/");
  }

  function handleExitWithoutSaving() {
    setExitDialogOpen(false);
    resetCreateContractDraft();
    router.push("/");
  }

  return (
    <>
      <div className="flex w-full flex-wrap items-center gap-2 rounded-full bg-white p-2 shadow-sm">
        <button
          type="button"
          onClick={handleHomeClick}
          className={cn(
            pillBaseClassName,
            "bg-brand-background-green text-brand hover:bg-brand-background-green/80",
          )}
        >
          <Home className="size-4 shrink-0" aria-hidden />
          {labels.home}
        </button>

        <span className={cn(pillBaseClassName, "bg-brand text-white")}>
          {pageTitle}
        </span>

        {contractId ? (
          <button
            type="button"
            onClick={() => void handleCopyRequest()}
            className={cn(
              pillBaseClassName,
              "bg-brand-background-green text-brand hover:bg-brand-background-green/80",
            )}
          >
            <Copy className="size-4 shrink-0" aria-hidden />
            {labels.requestPrefix} #{contractId}
          </button>
        ) : null}

        <Link
          href={labels.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            pillBaseClassName,
            "ms-auto bg-brand-background-green text-brand hover:bg-brand-background-green/80",
          )}
        >
          <FaWhatsapp className="size-4 shrink-0 text-[#25D366]" aria-hidden />
          {labels.help}
        </Link>
      </div>

      <CreateContractExitHomeDialog
        labels={labels.exitHomeDialog}
        open={exitDialogOpen}
        onOpenChange={setExitDialogOpen}
        orderNumber={contractId}
        isSaving={isSaving}
        onSaveThenExit={() => void handleSaveThenExit()}
        onExitWithoutSaving={handleExitWithoutSaving}
      />
    </>
  );
}
