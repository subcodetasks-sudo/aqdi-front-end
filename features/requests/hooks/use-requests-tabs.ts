"use client";

import { useState } from "react";

import type { RequestUnitTab } from "@/features/requests/types/request";

export function useRequestsTabs() {
  const [activeTab, setActiveTab] = useState<RequestUnitTab>("residential");

  function selectTab(tab: RequestUnitTab) {
    setActiveTab(tab);
  }

  return {
    activeTab,
    selectTab,
  };
}
