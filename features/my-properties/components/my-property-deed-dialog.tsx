"use client";

import { useTranslations } from "next-intl";

import AttachmentPreviewDialog from "@/features/shared/components/attachment-preview-dialog";
import {
  fileNameFromUrl,
  resolveAttachmentKind,
} from "@/features/shared/utils/attachment-preview-actions";

type MyPropertyDeedDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deedImageUrl: string;
};

export default function MyPropertyDeedDialog({
  open,
  onOpenChange,
  deedImageUrl,
}: MyPropertyDeedDialogProps) {
  const t = useTranslations("myProperties.card.deedDialog");

  return (
    <AttachmentPreviewDialog
      open={open}
      onOpenChange={onOpenChange}
      labels={{
        title: t("title"),
        close: t("close"),
        print: t("print"),
        download: t("download"),
        view: t("view"),
      }}
      fileName={fileNameFromUrl(deedImageUrl)}
      url={deedImageUrl}
      kind={resolveAttachmentKind(undefined, deedImageUrl)}
    />
  );
}
