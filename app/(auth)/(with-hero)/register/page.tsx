import { getTranslations } from "next-intl/server";

import AuthBackButton from "@/features/auth/components/auth-back-button";
import RegisterFooter from "@/features/auth/components/register-footer";
import RegisterForm from "@/features/auth/components/register-form";
import RegisterHeader from "@/features/auth/components/register-header";

export default async function RegisterPage() {
  const t = await getTranslations("auth.register");

  return (
    <div className="relative flex flex-1 flex-col p-6">
        <AuthBackButton title={t("title")} label={t("back")} href="/login" />

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-4 py-4">
        <RegisterForm />
        <RegisterFooter
          orLabel={t("or")}
          hasAccount={t("hasAccount")}
          signIn={t("signIn")}
        />
      </div>
    </div>
  );
}
