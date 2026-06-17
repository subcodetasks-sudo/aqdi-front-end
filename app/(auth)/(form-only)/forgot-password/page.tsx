import { getTranslations } from "next-intl/server";

import AuthBackButton from "@/features/auth/components/auth-back-button";
import ForgotPasswordForm from "@/features/auth/components/forgot-password-form";
import ForgotPasswordHeader from "@/features/auth/components/forgot-password-header";

export default async function ForgotPasswordPage() {
  const t = await getTranslations("auth.forgotPassword");

  return (
    <>
      <div className="absolute top-6 inset-s-6 z-10">
        <AuthBackButton label={t("back")} href="/login" />
      </div>

      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl lg:rounded-[48px] lg:p-8">
        <div className="flex flex-col gap-8">
          <ForgotPasswordHeader
            title={t("title")}
            subtitle={t("subtitle")}
          />
          <ForgotPasswordForm />
        </div>
      </div>
    </>
  );
}
