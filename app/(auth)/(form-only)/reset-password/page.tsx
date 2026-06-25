import { getTranslations } from "next-intl/server";

import AuthBackButton from "@/features/auth/components/auth-back-button";
import ResetPasswordForm from "@/features/auth/components/reset-password-form";
import ResetPasswordHeader from "@/features/auth/components/reset-password-header";
import { repairPhoneFromQueryParam } from "@/features/auth/utils/normalize-saudi-phone";

type ResetPasswordPageProps = {
  searchParams: Promise<{
    phone?: string;
    code?: string;
  }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const t = await getTranslations("auth.resetPassword");
  const { phone: rawPhone, code } = await searchParams;
  const phone = repairPhoneFromQueryParam(rawPhone);

  return (
    <>
      <div className="absolute top-6 inset-s-6 z-10">
        <AuthBackButton label={t("back")} href="/forgot-password" />
      </div>

      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl lg:rounded-[48px] lg:p-8">
        <div className="flex flex-col gap-8">
          <ResetPasswordHeader title={t("title")} subtitle={t("subtitle")} />
          <ResetPasswordForm phone={phone} code={code} />
        </div>
      </div>
    </>
  );
}
