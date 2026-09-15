"use client";

import { useEffect } from "react";

import { initFirebaseAnalytics } from "@/features/notifications/services/firebase-client";
import { registerFirebaseServiceWorker } from "@/features/notifications/services/get-fcm-token";

export function FirebaseInit() {
  useEffect(() => {
    void initFirebaseAnalytics();
    void registerFirebaseServiceWorker();
  }, []);

  return null;
}
