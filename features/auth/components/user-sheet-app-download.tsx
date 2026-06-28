
import { FaApple, FaGooglePlay } from "react-icons/fa";
import { Smartphone } from "lucide-react";

import UserSheetStoreButton from "@/features/auth/components/user-sheet-store-button";
import MobileAppLable from "@/features/shared/components/mobile-app-lable";

type UserSheetAppDownloadProps = {
  title: string;
  downloadOnThe: string;
  googlePlay: string;
  appStore: string;
};

export default function UserSheetAppDownload({
  title,
  downloadOnThe,
  googlePlay,
  appStore,
}: UserSheetAppDownloadProps) {
  return (
    <section className="space-y-3">
    <div className="flex items-center justify-center gap-2">
      <Smartphone className="size-4 shrink-0 text-foreground" aria-hidden="true" />
      <p className="text-sm font-bold text-black">{title}</p>
      <div className="h-[3px] w-6 bg-black" />
    </div> 

      <div className="flex items-stretch gap-3">
        <UserSheetStoreButton
          href="https://play.google.com/store"
          variant="google"
          labelTop={downloadOnThe}
          labelBottom={googlePlay}
          icon={<FaGooglePlay className="size-6" aria-hidden="true" />}
        />
        <UserSheetStoreButton
          href="https://apps.apple.com"
          variant="apple"
          labelTop={downloadOnThe}
          labelBottom={appStore}
          icon={<FaApple className="size-6" aria-hidden="true" />}
        />
      </div>
    </section>
  );
}
