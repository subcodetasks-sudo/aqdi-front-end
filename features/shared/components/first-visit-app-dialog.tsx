"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import { Smartphone, X } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

const FIRST_VISIT_APP_DIALOG_KEY = "aqdi:first-visit-app-dialog-seen";
const APP_DIALOG_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;

export default function FirstVisitAppDialog() {
  const t = useTranslations("firstVisitAppDialog");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isHomeRoute = pathname === "/";

  useEffect(() => {
    if (!isHomeRoute) {
      window.setTimeout(() => setOpen(false), 0);
      return;
    }

    try {
      const lastDismissedAt = Number(
        window.localStorage.getItem(FIRST_VISIT_APP_DIALOG_KEY),
      );

      if (
        Number.isFinite(lastDismissedAt) &&
        Date.now() - lastDismissedAt < APP_DIALOG_COOLDOWN_MS
      ) {
        return;
      }

      window.setTimeout(() => setOpen(true), 0);
    } catch {
      window.setTimeout(() => setOpen(true), 0);
    }
  }, [isHomeRoute]);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (!nextOpen) {
      try {
        window.localStorage.setItem(
          FIRST_VISIT_APP_DIALOG_KEY,
          String(Date.now()),
        );
      } catch {
        // The dialog still closes when browser storage is unavailable.
      }
    }
  }

  return (
    <Dialog
      open={open && isHomeRoute}
      onOpenChange={handleOpenChange}
    >
      <DialogContent
        showCloseButton={false}
        aria-describedby="first-visit-app-dialog-description"
        className="w-[calc(100%-1.5rem)] max-w-[680px] gap-0 rounded-[44px] bg-white px-5 pb-8 pt-8 text-black shadow-2xl sm:w-[calc(100%-3rem)] sm:max-w-[800px] sm:rounded-[60px] sm:px-12 sm:pb-12 sm:pt-12"
        overlayClassName="bg-black/45 backdrop-blur-[1px]"
      >
        <DialogClose
                  className="absolute -top-3 left-5 z-10 flex size-7 items-center justify-center rounded-full border-2 border-[#9c9c9c] bg-white text-[#777] transition-colors hover:bg-[#f4f4f4] focus-visible:outline-3 focus-visible:outline-gray-500 sm:left-12"
          aria-label={t("close")}
        >
          <X className="size-4" strokeWidth={2} aria-hidden="true" />
        </DialogClose>

        <div className="text-center">
          <DialogTitle className="text-[22px] font-bold leading-tight text-black sm:text-2xl">
            {t("title")}
          </DialogTitle>
          <DialogDescription
            id="first-visit-app-dialog-description"
            className="mx-auto mt-2 max-w-[440px] text-[11px] font-normal leading-6 text-[#555] sm:text-xs"
          >
            {t("description")}
          </DialogDescription>
        </div>

        <div className="mt-5 overflow-hidden rounded-[26px]  sm:mt-5 sm:rounded-[28px]">
          <Image
            src="/images/first-visit-dialog-image.png"
            alt={t("imageAlt")}
            width={679}
            height={340}
            className="h-auto w-full"
            priority
          />
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-black sm:mt-5">
          <div className="h-[2px] w-4 bg-black sm:w-6" aria-hidden="true" />
          <span className="text-sm font-bold sm:text-base">{t("downloadNow")}</span>
          <Smartphone className="size-4" strokeWidth={1.7} aria-hidden="true" />
        </div>

        <div className="mt-4 flex items-center justify-center gap-2" dir="ltr">
          <a
            href="https://play.google.com/store/apps/details?id=com.alaqed.alaqed"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("googlePlay")}
            className="inline-flex h-11 w-[136px] items-center justify-center gap-2 rounded-[10px] border border-[#dedede] bg-[#f7f7f7] px-2 text-left text-[#303030] transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <FaGooglePlay className="size-5 shrink-0" aria-hidden="true" />
            <span className="flex flex-col leading-[1.05]">
              <span className="text-[7px] font-normal">Download On The</span>
              <span className="text-[13px] font-bold">Google Play</span>
            </span>
          </a>
          <a
            href="https://apps.apple.com/us/app/aqdi/id6670163340"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("appStore")}
            className="inline-flex h-11 w-[136px] items-center justify-center gap-2 rounded-[10px] bg-black px-2 text-left text-white transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <FaApple className="size-5 shrink-0" aria-hidden="true" />
            <span className="flex flex-col leading-[1.05]">
              <span className="text-[7px] font-normal">Download On The</span>
              <span className="text-[13px] font-bold">App Store</span>
            </span>
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}