"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronsLeft, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import ProfileNameField from "@/features/auth/components/profile-name-field";
import ProfilePhoneField from "@/features/auth/components/profile-phone-field";
import {
  createProfileSchema,
  type ProfileFormValues,
} from "@/features/auth/schemas/profile-schema";
import { updateProfile } from "@/features/auth/services/update-profile";
import { useAuthStore } from "@/features/auth/stores/use-auth-store";
import type { AuthUser } from "@/features/auth/types/auth-user";

type ProfileFormProps = {
  user: AuthUser;
  onSuccess?: () => void;
};

export default function ProfileForm({ user, onSuccess }: ProfileFormProps) {
  const t = useTranslations("auth.profile");
  const setUser = useAuthStore((state) => state.setUser);

  const schema = createProfileSchema({
    fullNameRequired: t("validation.fullNameRequired"),
    fullNameMin: t("validation.fullNameMin"),
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: user.full_name || user.name,
    },
  });

  useEffect(() => {
    form.reset({
      fullName: user.full_name || user.name,
    });
  }, [user, form]);

  async function onSubmit(values: ProfileFormValues) {
    const profileResponse = await updateProfile({ fullName: values.fullName });

    if (!profileResponse.ok) {
      toast.error(profileResponse.error || t("submitError"));
      return;
    }

    setUser(profileResponse.user);

    toast.success(profileResponse.message || t("submitSuccess"));
    form.reset({
      fullName: profileResponse.user.full_name || profileResponse.user.name,
    });
    onSuccess?.();
  }

  const phoneValue = user.mobile || user.phone;
  const { isSubmitting } = form.formState;

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-5"
      noValidate
    >
      <ProfileNameField
        control={form.control}
        label={t("fullNameLabel")}
        placeholder={t("fullNamePlaceholder")}
      />

      <ProfilePhoneField label={t("phoneLabel")} value={phoneValue} />

      <Button
        type="submit"
        disabled={isSubmitting}
        className="group h-14 w-full gap-2 rounded-full bg-linear-to-r from-brand to-brand-secondary text-base font-semibold text-white hover:opacity-95"
      >
        {isSubmitting ? (
          <Loader2 className="size-5 animate-spin" aria-hidden="true" />
        ) : (
          <>
            <ChevronsLeft className="size-4" aria-hidden="true" />
            <span>{t("submit")}</span>
            <ChevronsLeft className="size-4 scale-x-[-1]" aria-hidden="true" />
          </>
        )}
      </Button>
    </form>
  );
}
