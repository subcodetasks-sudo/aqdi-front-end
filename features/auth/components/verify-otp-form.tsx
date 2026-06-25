"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpLeft, Loader2, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import VerifyOtpInput from "@/features/auth/components/verify-otp-input";
import { useOtpTimer } from "@/features/auth/hooks/use-otp-timer";
import {
  createVerifyOtpSchema,
  type VerifyOtpFormValues,
} from "@/features/auth/schemas/verify-otp-schema";
import { verifyResetPasswordCode } from "@/features/auth/services/verify-reset-password-code";
import { requestForgotPassword } from "@/features/auth/services/request-forgot-password";
import { resendOtp } from "@/features/auth/services/resend-otp";
import { verifyOtp } from "@/features/auth/services/verify-otp";
import { buildResetPasswordUrl } from "@/features/auth/utils/build-reset-password-url";
import { cn } from "@/lib/utils";
import AuthOrDivider from "./auth-or-divider";

type VerifyOtpFormProps = {
  phone?: string;
  flow?: string;
};

export default function VerifyOtpForm({ phone, flow }: VerifyOtpFormProps) {
  const t = useTranslations("auth.verifyOtp");
  const router = useRouter();
  const { formatted, isExpired, reset } = useOtpTimer(59);

  const schema = createVerifyOtpSchema({
    otpRequired: t("validation.otpRequired"),
    otpInvalid: t("validation.otpInvalid"),
  });

  const form = useForm<VerifyOtpFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      otp: "",
    },
  });

  const otpValue = form.watch("otp");
  const isOtpComplete = otpValue.length === 4;
  const [isResending, setIsResending] = useState(false);
  const { isSubmitting } = form.formState;

  async function onSubmit(values: VerifyOtpFormValues) {
    if (!phone) {
      toast.error(t("phoneMissing"));
      return;
    }

    const response =
      flow === "forgot-password"
        ? await verifyResetPasswordCode({
            phone,
            code: values.otp,
          })
        : await verifyOtp({
            phone,
            verificationCode: values.otp,
          });

    if (!response.ok) {
      toast.error(response.error || t("submitError"));
      return;
    }

    toast.success(response.message || t("submitSuccess"));

    if (flow === "forgot-password") {
      router.push(buildResetPasswordUrl(phone, values.otp));
      return;
    }

    router.push("hasToken" in response && response.hasToken ? "/" : "/login");
  }

  async function handleResend() {
    if (!isExpired || isResending) {
      return;
    }

    if (!phone) {
      toast.error(t("phoneMissing"));
      return;
    }

    setIsResending(true);

    try {
      const response =
        flow === "forgot-password"
          ? await requestForgotPassword({ phone })
          : await resendOtp({ phone });

      if (!response.ok) {
        toast.error(response.error || t("resendError"));
        return;
      }

      reset();
      form.reset({ otp: "" });
      toast.success(response.message || t("resendSuccess"));
    } finally {
      setIsResending(false);
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
      noValidate
    >
      <VerifyOtpInput control={form.control} label={t("otpLabel")} />

      <Button
        type="submit"
        disabled={isSubmitting || !isOtpComplete}
        className={cn(
          "group h-12 w-full rounded-full text-base font-semibold",
          isOtpComplete
            ? "bg-brand text-white hover:bg-brand/90"
            : "bg-[#e8e8e8] text-gray-500 hover:bg-[#e8e8e8]",
        )}
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

      <div className="flex flex-col items-center gap-3">
        <span className="inline-flex min-w-16 items-center justify-center rounded-full bg-black px-3 py-1 text-sm font-medium text-white">
          {formatted}
        </span>

        <AuthOrDivider label={t("notReceived")} />
        <Button
          type="button"
          variant="outline"
          disabled={!isExpired || isResending}
          onClick={handleResend}
          className="h-12 w-full rounded-full border-[#e5e5e5] bg-[#f3f3f3] text-sm font-medium text-foreground hover:bg-brand hover:text-white disabled:opacity-60"
        >
          {isResending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <>
              {t("resend")}
              <RefreshCw className="size-4" aria-hidden="true" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
