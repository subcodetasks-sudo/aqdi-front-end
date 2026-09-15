"use client";

import { useEffect } from "react";

import { getWebsiteStatus } from "@/features/website-status/services/get-website-status";

const POLL_INTERVAL_MS = 60_000;

/**
 * Renders nothing. Re-checks the boot status once a minute and reloads the page
 * as soon as the service is back, so the maintenance notice clears on its own.
 */
export default function MaintenancePoller() {
  useEffect(() => {
    const interval = setInterval(async () => {
      const status = await getWebsiteStatus();
      if (status.isOpen) {
        window.location.assign("/");
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  return null;
}
