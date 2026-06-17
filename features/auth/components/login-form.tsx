"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpLeft } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import LoginPasswordField from "@/features/auth/components/login-password-field";
import LoginPhoneField from "@/features/auth/components/login-phone-field";
import {
  createLoginSchema,
  type LoginFormValues,
} from "@/features/auth/schemas/login-schema";

export default function LoginForm() {
  const t = useTranslations("auth.login");

  const schema = createLoginSchema({
    phoneRequired: t("validation.phoneRequired"),
    phoneInvalid: t("validation.phoneInvalid"),
    passwordRequired: t("validation.passwordRequired"),
    passwordMin: t("validation.passwordMin"),
  });

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      phone: "",
      password: "",
      rememberMe: false,
    },
  });

  function onSubmit(values: LoginFormValues) {
    console.log("Login submitted:", values);
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-5"
      noValidate
    >
      <LoginPhoneField
        control={form.control}
        label={t("phoneLabel")}
        placeholder={t("phonePlaceholder")}
      />

      <LoginPasswordField
        control={form.control}
        label={t("passwordLabel")}
        placeholder={t("passwordPlaceholder")}
        toggleVisibilityLabel={t("togglePasswordVisibility")}
      />

      <div className="flex items-center justify-between gap-4">
        <Controller
          name="rememberMe"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              orientation="horizontal"
              data-invalid={fieldState.invalid}
              className="w-auto items-center gap-2"
            >
              <Checkbox
                id="rememberMe"
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                aria-invalid={fieldState.invalid}
                className="data-[state=checked]:bg-brand data-[state=checked]:text- bg-brand-background"
              />
              <FieldLabel htmlFor="rememberMe" className="font-normal">
                {t("rememberMe")}
              </FieldLabel>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Link
          href="/forgot-password"
          className="shrink-0 text-sm font-medium text-brand transition-colors hover:text-brand/80"
        >
          {t("forgotPassword")}
        </Link>
      </div>

      <Button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="group h-12 w-full rounded-full bg-brand text-base font-semibold text-white hover:bg-brand/90"
      >
        {t("submit")}
        <ArrowUpLeft
          className="size-4 -rotate-45 group-hover:rotate-0 transition-transform duration-300"
          aria-hidden="true"
        />
      </Button>
    </form>
  );
}
