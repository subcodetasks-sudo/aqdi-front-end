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
import { deleteUnit } from "@/features/property-units/services/delete-unit";

type PropertyUnitDeleteButtonProps = {
  unitId: number;
};

export default function PropertyUnitDeleteButton({
  unitId,
}: PropertyUnitDeleteButtonProps) {
  const t = useTranslations("propertyUnits.card");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);

    try {
      const result = await deleteUnit(unitId);

      if (!result.ok) {
        toast.error(result.error || t("deleteDialog.error"));
        return;
      }

      toast.success(result.message || t("deleteDialog.success"));
      setOpen(false);
      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          aria-label={t("deleteUnit")}
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-[#e53935] transition-colors hover:bg-red-50"
        >
          <Trash2 className="size-4" aria-hidden="true" />
        </button>
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
