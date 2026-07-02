"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteContract } from "@/features/requests/services/delete-contract";
import { resetCreateContractDraft } from "@/features/create-contract/utils/reset-create-contract-draft";

type CreateContractCancelRequestButtonProps = {
  contractId: number;
  label: string;
};

export default function CreateContractCancelRequestButton({
  contractId,
  label,
}: CreateContractCancelRequestButtonProps) {
  const t = useTranslations("requests.card");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);

    try {
      const result = await deleteContract(contractId);

      if (!result.ok) {
        toast.error(result.error || t("deleteDialog.error"));
        return;
      }

      resetCreateContractDraft();
      toast.success(result.message || t("deleteDialog.success"));
      setOpen(false);
      router.push("/requests");
      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="h-auto gap-2 rounded-xl bg-[#fff0f0] px-4 py-2 text-sm font-semibold text-red-500 hover:bg-[#ffe5e5] hover:text-red-600"
        >
          <Trash2 className="size-4" aria-hidden="true" />
          {label}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="rounded-3xl sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>{t("deleteDialog.title")}</AlertDialogTitle>
          <AlertDialogDescription className="text-start">
            {t("deleteDialog.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            {t("deleteDialog.cancel")}
          </AlertDialogCancel>
          <Button
            type="button"
            variant="destructive"
            disabled={isDeleting}
            onClick={handleDelete}
          >
            {isDeleting ? t("deleteDialog.deleting") : t("deleteDialog.confirm")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
