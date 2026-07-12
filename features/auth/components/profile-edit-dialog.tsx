"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import ProfileForm from "@/features/auth/components/profile-form";
import type { AuthUser } from "@/features/auth/types/auth-user";

type ProfileEditDialogProps = {
  user: AuthUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ProfileEditDialog({
  user,
  open,
  onOpenChange,
}: ProfileEditDialogProps) {
  const t = useTranslations("auth.profile");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="gap-0 overflow-y-auto rounded-3xl p-6 sm:max-w-md max-h-[90vh] bg-[#f8f8f8]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#ececec] pb-4">
          <DialogTitle className="text-base font-bold leading-snug text-brand">
            {t("title")}
          </DialogTitle>

          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="shrink-0 text-red-500 hover:bg-red-50 hover:text-red-600"
              aria-label={t("close")}
            >
              <X className="size-4" aria-hidden="true" />
            </Button>
          </DialogClose>
        </div>

        <div className="mt-6">
          <ProfileForm user={user} onSuccess={() => onOpenChange(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
