"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpLeft, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import LoginPhoneField from "@/features/auth/components/login-phone-field";
import {
  createLoginSchema,
  type LoginFormValues,
} from "@/features/auth/schemas/login-schema";
import { resendOtp } from "@/features/auth/services/resend-otp";
import { buildVerifyOtpUrl } from "@/features/auth/utils/build-verify-otp-url";

export default function LoginForm() {
  const t = useTranslations("auth.login");
  const router = useRouter();
  const searchParams = useSearchParams();

  const schema = createLoginSchema({
    phoneRequired: t("validation.phoneRequired"),
    phoneInvalid: t("validation.phoneInvalid"),
  });

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      phone: "",
      rememberMe: false,
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: LoginFormValues) {
    const response = await resendOtp({ phone: values.phone });

    if (!response.ok) {
      toast.error(response.error || t("submitError"));
      return;
    }

    toast.success(response.message || t("submitSuccess"));
    router.push(
      buildVerifyOtpUrl(values.phone, "login", {
        rememberMe: values.rememberMe,
        callbackUrl: searchParams.get("callbackUrl"),
      }),
    );
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

      <Button
        type="submit"
        disabled={isSubmitting}
        className="group h-12 w-full rounded-full bg-brand text-base font-semibold text-white hover:bg-brand/90"
      >
        {isSubmitting ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <>
            {t("submit")}
            <ArrowUpLeft
              className="size-4 -rotate-45 transition-transform duration-300 group-hover:rotate-0"
              aria-hidden="true"
            />
          </>
        )}
      </Button>
    </form>
  );
}
