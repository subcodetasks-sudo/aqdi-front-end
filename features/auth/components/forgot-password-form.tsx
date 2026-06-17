"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import ForgotPasswordFooter from "@/features/auth/components/forgot-password-footer";
import ForgotPasswordPhoneField from "@/features/auth/components/forgot-password-phone-field";
import {
  createForgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/features/auth/schemas/forgot-password-schema";
import { buildVerifyOtpUrl } from "@/features/auth/utils/build-verify-otp-url";

export default function ForgotPasswordForm() {
  const t = useTranslations("auth.forgotPassword");
  const router = useRouter();

  const schema = createForgotPasswordSchema({
    phoneRequired: t("validation.phoneRequired"),
    phoneInvalid: t("validation.phoneInvalid"),
  });

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      phone: "",
    },
  });

  function onSubmit(values: ForgotPasswordFormValues) {
    router.push(buildVerifyOtpUrl(values.phone, "forgot-password"));
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
      noValidate
    >
      <ForgotPasswordPhoneField
        control={form.control}
        label={t("phoneLabel")}
        placeholder={t("phonePlaceholder")}
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

      <ForgotPasswordFooter
        orLabel={t("or")}
        rememberedPassword={t("rememberedPassword")}
        backToLogin={t("backToLogin")}
      />
    </form>
  );
}
