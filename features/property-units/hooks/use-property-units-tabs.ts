"use client";

import { useState } from "react";

import type { PropertyUnitTab } from "@/features/property-units/types/property-unit";

export function usePropertyUnitsTabs(initialTab: PropertyUnitTab = "residential") {
  const [activeTab, setActiveTab] = useState<PropertyUnitTab>(initialTab);

  function selectTab(tab: PropertyUnitTab) {
    setActiveTab(tab);
  }

  return {
    activeTab,
    selectTab,
  };
}
