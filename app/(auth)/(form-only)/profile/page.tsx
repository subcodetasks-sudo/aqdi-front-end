import { getTranslations } from "next-intl/server";

import AuthBackButton from "@/features/auth/components/auth-back-button";
import ProfileForm from "@/features/auth/components/profile-form";

export default async function ProfilePage() {
  const t = await getTranslations("auth.profile");

  return (
    <>
      <div className="absolute top-6 inset-s-6 z-10">
        <AuthBackButton label={t("back")} href="/" />
      </div>

      <div className="w-full max-w-md ">
        <ProfileForm />
      </div>
    </>
  );
}
