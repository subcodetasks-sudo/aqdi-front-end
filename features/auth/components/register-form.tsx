"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import RegisterEmailField from "@/features/auth/components/register-email-field";
import RegisterNameField from "@/features/auth/components/register-name-field";
import RegisterPasswordField from "@/features/auth/components/register-password-field";
import RegisterPhoneField from "@/features/auth/components/register-phone-field";
import RegisterTermsField from "@/features/auth/components/register-terms-field";
import {
  createRegisterSchema,
  type RegisterFormValues,
} from "@/features/auth/schemas/register-schema";

export default function RegisterForm() {
  const t = useTranslations("auth.register");

  const schema = createRegisterSchema({
    fullNameRequired: t("validation.fullNameRequired"),
    fullNameMin: t("validation.fullNameMin"),
    phoneRequired: t("validation.phoneRequired"),
    phoneInvalid: t("validation.phoneInvalid"),
    emailRequired: t("validation.emailRequired"),
    emailInvalid: t("validation.emailInvalid"),
    passwordRequired: t("validation.passwordRequired"),
    passwordMin: t("validation.passwordMin"),
    termsRequired: t("validation.termsRequired"),
  });

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      password: "",
      acceptTerms: false,
    },
  });

  function onSubmit(values: RegisterFormValues) {
    console.log("Register submitted:", values);
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-5"
      noValidate
    >
      <RegisterNameField
        control={form.control}
        label={t("fullNameLabel")}
        placeholder={t("fullNamePlaceholder")}
      />

      <RegisterPhoneField
        control={form.control}
        label={t("phoneLabel")}
        placeholder={t("phonePlaceholder")}
      />

      <RegisterEmailField
        control={form.control}
        label={t("emailLabel")}
        placeholder={t("emailPlaceholder")}
      />

      <RegisterPasswordField
        control={form.control}
        label={t("passwordLabel")}
        placeholder={t("passwordPlaceholder")}
        toggleVisibilityLabel={t("togglePasswordVisibility")}
      />

      <RegisterTermsField
        control={form.control}
        prefix={t("terms.prefix")}
        termsLink={t("terms.termsLink")}
        andLabel={t("terms.and")}
        privacyLink={t("terms.privacyLink")}
        termsHref={t("terms.termsHref")}
        privacyHref={t("terms.privacyHref")}
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
