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
import { deleteAccount } from "@/features/auth/services/delete-account";
import { useAuthStore } from "@/features/auth/stores/use-auth-store";
import { clearClientAuthTokens } from "@/lib/api/client-token-storage";

export default function ProfileDeleteAccountButton() {
  const t = useTranslations("auth.profile");
  const router = useRouter();
  const clearUser = useAuthStore((state) => state.clearUser);
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);

    try {
      const result = await deleteAccount();

      if (!result.ok) {
        toast.error(result.error || t("deleteDialog.error"));
        return;
      }

      clearUser();
      clearClientAuthTokens();
      setOpen(false);
      toast.success(result.message || t("deleteDialog.success"));
      router.push("/login");

      void import("@/features/notifications/services/get-fcm-token").then(
        ({ disconnectFcmToken }) => disconnectFcmToken(),
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          className="mx-auto flex items-center gap-2 text-sm font-semibold text-destructive transition-opacity hover:opacity-80"
        >
          <Trash2 className="size-4" aria-hidden="true" />
          {t("deleteAccount")}
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
