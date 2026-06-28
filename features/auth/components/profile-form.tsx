"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronsLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import ProfileAvatar from "@/features/auth/components/profile-avatar";
import ProfileDeleteAccountButton from "@/features/auth/components/profile-delete-account-button";
import ProfileNameField from "@/features/auth/components/profile-name-field";
import ProfilePasswordField from "@/features/auth/components/profile-password-field";
import ProfilePhoneField from "@/features/auth/components/profile-phone-field";
import {
  createProfileSchema,
  type ProfileFormValues,
} from "@/features/auth/schemas/profile-schema";
import { updateProfile } from "@/features/auth/services/update-profile";
import { updatePassword } from "@/features/auth/services/update-password";
import { useAuthStore } from "@/features/auth/stores/use-auth-store";

export default function ProfileForm() {
  const t = useTranslations("auth.profile");
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const schema = createProfileSchema({
    fullNameRequired: t("validation.fullNameRequired"),
    fullNameMin: t("validation.fullNameMin"),
    passwordMin: t("validation.passwordMin"),
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      password: "",
    },
  });

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }

    form.reset({
      fullName: user.full_name || user.name,
      password: "",
    });
  }, [user, router, form]);

  async function onSubmit(values: ProfileFormValues) {
    if (!user) {
      return;
    }

    const profileResponse = await updateProfile({ fullName: values.fullName });

    if (!profileResponse.ok) {
      toast.error(profileResponse.error || t("submitError"));
      return;
    }

    setUser(profileResponse.user);

    let successMessage = profileResponse.message || t("submitSuccess");
    const trimmedPassword = values.password?.trim() ?? "";

    if (trimmedPassword) {
      const passwordResponse = await updatePassword({
        password: trimmedPassword,
        passwordConfirmation: trimmedPassword,
      });

      if (!passwordResponse.ok) {
        toast.error(passwordResponse.error || t("passwordUpdateError"));
        form.reset({
          fullName: profileResponse.user.full_name || profileResponse.user.name,
          password: "",
        });
        return;
      }

      successMessage = passwordResponse.message || successMessage;
    }

    toast.success(successMessage);
    form.reset({
      fullName: profileResponse.user.full_name || profileResponse.user.name,
      password: "",
    });
  }

  if (!user) {
    return null;
  }

  const displayName = user.full_name || user.name;
  const phoneValue = user.mobile || user.phone;
  const { isSubmitting } = form.formState;

  return (
    <div className="flex flex-col gap-8">
      <ProfileAvatar
        name={displayName}
        photo={user.photo}
        avatarAlt={t("avatarAlt")}
      />

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

        <ProfilePasswordField
          control={form.control}
          label={t("passwordLabel")}
          placeholder={t("passwordPlaceholder")}
          toggleVisibilityLabel={t("togglePasswordVisibility")}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="group h-14 w-full gap-2 rounded-full bg-gradient-to-r from-brand to-brand-secondary text-base font-semibold text-white hover:opacity-95"
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

      {/* <ProfileDeleteAccountButton /> */}
    </div>
  );
}
