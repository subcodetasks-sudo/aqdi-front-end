"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppSettings } from "@/features/settings/hooks/use-app-settings";

export type LegalDocumentKind = "terms" | "privacy";

type LegalDocumentDialogProps = {
  document: LegalDocumentKind | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function LegalDocumentDialog({
  document,
  open,
  onOpenChange,
}: LegalDocumentDialogProps) {
  const tLegal = useTranslations("legal");
  const tTerms = useTranslations("legal.terms");
  const tPrivacy = useTranslations("legal.privacy");
  const { data: settings, isLoading, isError } = useAppSettings();

  const isPrivacy = document === "privacy";
  const title = isPrivacy ? tPrivacy("title") : tTerms("title");
  const emptyLabel = isPrivacy ? tPrivacy("empty") : tTerms("empty");
  const html = (
    isPrivacy ? settings?.privacy.description : settings?.terms.description
  )?.trim() ?? "";
  const hasContent = html.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="gap-0 overflow-hidden rounded-3xl border-0 bg-white p-0 shadow-2xl sm:max-w-lg"
      >
        <div className="relative flex items-center justify-center border-b border-[#f0f0f0] px-4 py-4">
          <DialogTitle className="text-center text-base font-extrabold text-brand">
            {title}
          </DialogTitle>

          <DialogClose asChild>
            <button
              type="button"
              aria-label={tLegal("close")}
              className="absolute start-3 inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f0f0f0] text-[#9a9a9a] transition-colors hover:bg-[#e8e8e8] hover:text-[#666]"
            >
              <X className="size-4" strokeWidth={2.5} aria-hidden="true" />
            </button>
          </DialogClose>
        </div>

        <div className="max-h-[min(70vh,560px)] overflow-y-auto px-5 py-5">
          {isLoading ? (
            <div className="space-y-3">
              <div className="h-4 animate-pulse rounded bg-[#f0f0f0]" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-[#f0f0f0]" />
              <div className="h-4 w-4/6 animate-pulse rounded bg-[#f0f0f0]" />
            </div>
          ) : isError || !hasContent ? (
            <p className="text-sm leading-7 text-[#7a7a7a]">{emptyLabel}</p>
          ) : (
            <div
              className="space-y-4 text-sm leading-8 text-[#4d4d4d] [&_a]:font-bold [&_a]:text-brand [&_h2]:mt-6 [&_h2]:text-lg [&_h2]:font-extrabold [&_h2]:text-[#222222] [&_h3]:mt-4 [&_h3]:text-base [&_h3]:font-bold [&_li]:ms-5 [&_li]:list-disc [&_ol]:ms-5 [&_ol]:list-decimal [&_p]:mb-3 [&_p:last-child]:mb-0 [&_strong]:font-bold [&_ul]:ms-5 [&_ul]:list-disc"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
