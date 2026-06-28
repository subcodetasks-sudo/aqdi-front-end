import { Suspense } from "react";
import { getTranslations } from "next-intl/server";

import AuthBackButton from "@/features/auth/components/auth-back-button";
import LoginFooter from "@/features/auth/components/login-footer";
import LoginForm from "@/features/auth/components/login-form";
import LoginHeader from "@/features/auth/components/login-header";

export default async function LoginPage() {
  const t = await getTranslations("auth.login");

  return (
    <div className="relative flex flex-1 flex-col p-6">
      <div className="absolute top-6 inset-s-6">
        <AuthBackButton label={t("back")}  />
      </div>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-4 py-4">
        <LoginHeader greeting={t("greeting")} subtitle={t("subtitle")} />
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
        <LoginFooter
          orLabel={t("or")}
          noAccount={t("noAccount")}
          createAccount={t("createAccount")}
        />
      </div>
    </div>
  );
}
