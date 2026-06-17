"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import ResetPasswordPasswordField from "@/features/auth/components/reset-password-password-field";
import {
  createResetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/features/auth/schemas/reset-password-schema";

type ResetPasswordFormProps = {
  phone?: string;
};

export default function ResetPasswordForm({ phone }: ResetPasswordFormProps) {
  const t = useTranslations("auth.resetPassword");
  const router = useRouter();

  const schema = createResetPasswordSchema({
    passwordRequired: t("validation.passwordRequired"),
    passwordMin: t("validation.passwordMin"),
    confirmPasswordRequired: t("validation.confirmPasswordRequired"),
    passwordsMismatch: t("validation.passwordsMismatch"),
  });

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: ResetPasswordFormValues) {
    console.log("Reset password submitted:", { ...values, phone });
    router.push("/login");
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-5"
      noValidate
    >
      <ResetPasswordPasswordField
        control={form.control}
        name="password"
        label={t("passwordLabel")}
        placeholder={t("passwordPlaceholder")}
        toggleVisibilityLabel={t("togglePasswordVisibility")}
      />

      <ResetPasswordPasswordField
        control={form.control}
        name="confirmPassword"
        label={t("confirmPasswordLabel")}
        placeholder={t("confirmPasswordPlaceholder")}
        toggleVisibilityLabel={t("togglePasswordVisibility")}
        autoComplete="new-password"
      />

      <Button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="group h-12 w-full rounded-full bg-brand text-base font-semibold text-white hover:bg-brand/90"
      >
        {t("submit")}
        <ArrowUpLeft
          className="size-4 -rotate-45 transition-transform duration-300 group-hover:rotate-0"
          aria-hidden="true"
        />
      </Button>
    </form>
  );
}
