"use client";

import { Copy, Home, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { FaWhatsapp } from "react-icons/fa";

import CreateContractExitHomeDialog from "@/features/create-contract/components/create-contract-exit-home-dialog";
import { useSaveContractDraft } from "@/features/create-contract/hooks/use-save-contract-draft";
import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import { resetCreateContractDraft } from "@/features/create-contract/utils/reset-create-contract-draft";
import { deleteContract } from "@/features/requests/services/delete-contract";
import { cn } from "@/lib/utils";

type CreateContractHeaderProps = {
  pageTitle: string;
  labels: CreateContractLabels["header"];
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
};

const pillBaseClassName =
  "inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full px-3 text-sm font-bold transition-colors sm:h-11 sm:gap-2 sm:px-4";

export default function CreateContractHeader({
  pageTitle,
  labels,
  isDarkMode,
  onToggleDarkMode,
}: CreateContractHeaderProps) {
  const router = useRouter();
  const tDelete = useTranslations("requests.card");
  const { saveDraft, isSaving } = useSaveContractDraft();
  const [exitDialogOpen, setExitDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const contractId = useCreateContractDraftStore(
    (state) =>
      state.contractSession?.contractId ??
      state.contractStep1Data?.contract_id ??
      null,
  );
  const contractUuid = useCreateContractDraftStore(
    (state) => state.contractSession?.uuid ?? null,
  );

  async function handleCopyRequest() {
    if (!contractUuid) {
      return;
    }

    const text = `${labels.requestPrefix} ${contractUuid}`;

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

  async function handleExitWithoutSaving() {
    if (!contractId) {
      setExitDialogOpen(false);
      resetCreateContractDraft();
      router.push("/");
      return;
    }

    setIsDeleting(true);

    try {
      const result = await deleteContract(contractId);

      if (!result.ok) {
        toast.error(result.error || tDelete("deleteDialog.error"));
        return;
      }

      toast.success(result.message || tDelete("deleteDialog.success"));
      setExitDialogOpen(false);
      resetCreateContractDraft();
      router.push("/");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <div className="flex w-full flex-col gap-2 rounded-3xl bg-white p-2 shadow-sm sm:flex-row sm:flex-wrap sm:items-center sm:rounded-full dark:border dark:border-[#2f403b] dark:bg-[#1a2421]">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            onClick={handleHomeClick}
            className={cn(
              pillBaseClassName,
              "bg-brand-background-green text-brand hover:bg-brand-background-green/80 dark:bg-[#16352f] dark:text-[#7dccc0] dark:hover:bg-[#1c4039]",
            )}
          >
            <Home className="size-4 shrink-0" aria-hidden />
            <span className="truncate">{labels.home}</span>
          </button>

          <span
            className={cn(
              pillBaseClassName,
              "min-w-0 flex-1 justify-center truncate bg-brand text-white sm:flex-none sm:justify-start",
            )}
            title={pageTitle}
          >
            <span className="truncate">{pageTitle}</span>
          </span>

          <button
            type="button"
            aria-label={isDarkMode ? labels.light : labels.dark}
            aria-pressed={isDarkMode}
            onClick={onToggleDarkMode}
            className={cn(
              pillBaseClassName,
              "ms-auto size-10 justify-center border border-[#e4e4e4] bg-white px-0 text-brand hover:bg-brand-background sm:hidden",
              isDarkMode &&
                "border-brand-secondary/40 bg-brand text-white hover:bg-brand/90",
            )}
          >
            {isDarkMode ? (
              <Sun className="size-4 shrink-0" aria-hidden />
            ) : (
              <Moon className="size-4 shrink-0" aria-hidden />
            )}
          </button>
        </div>

        <div className="flex min-w-0 flex-wrap items-center gap-2 sm:ms-auto">
          {contractUuid ? (
            <button
              type="button"
              onClick={() => void handleCopyRequest()}
              className={cn(
                pillBaseClassName,
                "max-w-full bg-brand-background-green text-brand hover:bg-brand-background-green/80 dark:bg-[#16352f] dark:text-[#7dccc0] dark:hover:bg-[#1c4039]",
              )}
            >
              <Copy className="size-4 shrink-0" aria-hidden />
              <span className="truncate">
                {labels.requestPrefix} {contractUuid}
              </span>
            </button>
          ) : null}

          <Link
            href={labels.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              pillBaseClassName,
              "bg-brand-background-green text-brand hover:bg-brand-background-green/80 dark:bg-[#16352f] dark:text-[#7dccc0] dark:hover:bg-[#1c4039]",
            )}
          >
            <FaWhatsapp
              className="size-4 shrink-0 text-[#25D366]"
              aria-hidden
            />
            {labels.help}
          </Link>

          <button
            type="button"
            aria-label={isDarkMode ? labels.light : labels.dark}
            aria-pressed={isDarkMode}
            onClick={onToggleDarkMode}
            className={cn(
              pillBaseClassName,
              "hidden border border-[#e4e4e4] bg-white text-brand hover:bg-brand-background sm:inline-flex",
              isDarkMode &&
                "border-brand-secondary/40 bg-brand text-white hover:bg-brand/90",
            )}
          >
            {isDarkMode ? (
              <Sun className="size-4 shrink-0" aria-hidden />
            ) : (
              <Moon className="size-4 shrink-0" aria-hidden />
            )}
            {isDarkMode ? labels.light : labels.dark}
          </button>
        </div>
      </div>

      <CreateContractExitHomeDialog
        labels={labels.exitHomeDialog}
        open={exitDialogOpen}
        onOpenChange={setExitDialogOpen}
        orderNumber={contractId}
        isSaving={isSaving}
        isExiting={isDeleting}
        onSaveThenExit={() => void handleSaveThenExit()}
        onExitWithoutSaving={() => void handleExitWithoutSaving()}
      />
    </>
  );
}
