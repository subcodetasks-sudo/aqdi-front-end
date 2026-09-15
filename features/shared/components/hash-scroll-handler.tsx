"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { APP_SECTION_ID } from "@/features/shared/constants/app-section";
import { scrollToSection } from "@/features/shared/utils/scroll-to-section";

export default function HashScrollHandler() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.location.hash !== `#${APP_SECTION_ID}`) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      scrollToSection(APP_SECTION_ID);
    }, 100);

    return () => window.clearTimeout(timeoutId);
  }, [pathname]);

  return null;
}
