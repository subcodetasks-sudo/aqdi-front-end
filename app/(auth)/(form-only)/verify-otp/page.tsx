import { getTranslations } from "next-intl/server";

import AuthBackButton from "@/features/auth/components/auth-back-button";
import VerifyOtpForm from "@/features/auth/components/verify-otp-form";
import VerifyOtpHeader from "@/features/auth/components/verify-otp-header";
import {
  getVerifyOtpBackHref,
} from "@/features/auth/utils/build-verify-otp-url";
import { formatPhoneDisplay } from "@/features/auth/utils/format-phone-display";

type VerifyOtpPageProps = {
  searchParams: Promise<{
    phone?: string;
    flow?: string;
  }>;
};

export default async function VerifyOtpPage({
  searchParams,
}: VerifyOtpPageProps) {
  const t = await getTranslations("auth.verifyOtp");
  const { phone, flow } = await searchParams;
  const displayPhone = formatPhoneDisplay(phone ?? t("defaultPhone"));
  const backHref = getVerifyOtpBackHref(flow);

  return (
    <>
      <div className="absolute top-6 inset-s-6 z-10">
        <AuthBackButton label={t("back")} href={backHref} />
      </div>

      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl lg:rounded-[48px] lg:p-8">
        <div className="flex flex-col gap-8">
          <VerifyOtpHeader
            title={t("title")}
            instruction={t("instruction")}
            phone={displayPhone}
          />
          <VerifyOtpForm phone={phone} flow={flow} />
        </div>
      </div>
    </>
  );
}
