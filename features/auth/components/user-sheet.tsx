"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Globe, LogOut } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import CustomIcon from "@/features/shared/components/custom-icon";
import UserSheetAppDownload from "@/features/auth/components/user-sheet-app-download";
import UserSheetHeader from "@/features/auth/components/user-sheet-header";
import UserSheetMenuRow from "@/features/auth/components/user-sheet-menu-row";
import UserSheetProfileSection from "@/features/auth/components/user-sheet-profile-section";
import UserSheetSectionCard from "@/features/auth/components/user-sheet-section-card";
import UserSheetSocialBar from "@/features/auth/components/user-sheet-social-bar";
import { useAuthStore } from "@/features/auth/stores/use-auth-store";
import UserSheetPolicyLinkIcon from "@/features/auth/components/user-sheet-policy-link-icon";

type UserSheetProps = {
  children: ReactNode;
};

export default function UserSheet({ children }: UserSheetProps) {
  const t = useTranslations("userSheet");
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.clearUser);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  function handleLogout() {
    clearUser();
    router.push("/login");
  }

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="flex h-full w-full max-w-md flex-col gap-0 overflow-y-auto rounded-tl-[40px] p-4 sm:max-w-md"
      >
        <UserSheetHeader title={t("title")} closeLabel={t("close")} />

        <div className="flex flex-1 flex-col gap-4 py-4">
          {user ? (
            <UserSheetProfileSection
              user={user}
              sectionTitle={t("profile.sectionTitle")}
              avatarAlt={t("profile.avatarAlt")}
            />
          ) : null}

          <UserSheetSectionCard title={t("policies.sectionTitle")}>
            <UserSheetMenuRow
              label={t("policies.terms")}
              icon={<UserSheetPolicyLinkIcon />}
              href={t("policies.termsHref")}
            />
            <UserSheetMenuRow
              label={t("policies.privacy")}
              icon={<UserSheetPolicyLinkIcon />}
              href={t("policies.privacyHref")}
            />
          </UserSheetSectionCard>

          <UserSheetSectionCard title={t("helpCenter.sectionTitle")}>
            <UserSheetMenuRow
              label={t("helpCenter.whatsapp")}
              icon={<FaWhatsapp className="size-4" aria-hidden="true" />}
              href={t("helpCenter.whatsappHref")}
              external
            />
          </UserSheetSectionCard>

          <UserSheetSectionCard title={t("accountSettings.sectionTitle")}>
            <UserSheetMenuRow
              label={t("accountSettings.language")}
              icon={<Globe className="size-4" aria-hidden="true" />}
              href="#"
            />
            <UserSheetMenuRow
              label={t("accountSettings.notifications")}
              icon={
                <CustomIcon
                  src="/icons/notification-bell.svg"
                  size={16}
                  className="text-brand"
                />
              }
              trailing={
                <Switch
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                  className="data-checked:bg-brand-secondary"
                  aria-label={t("accountSettings.notifications")}
                />
              }
            />
            <UserSheetMenuRow
              label={t("accountSettings.logout")}
              icon={<LogOut className="size-4" aria-hidden="true" />}
              onClick={handleLogout}
            />
          </UserSheetSectionCard>

          <UserSheetSocialBar
            followUs={t("social.followUs")}
            youtubeLabel={t("social.youtube")}
            twitterLabel={t("social.twitter")}
            tiktokLabel={t("social.tiktok")}
          />

          <UserSheetAppDownload
            title={t("downloadApp")}
            downloadOnThe={t("downloadOnThe")}
            googlePlay={t("googlePlay")}
            appStore={t("appStore")}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
