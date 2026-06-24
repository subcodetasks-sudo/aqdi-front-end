"use client";

import { useState } from "react";

import type { PropertyUnitTab } from "@/features/property-units/types/property-unit";

export function usePropertyUnitsTabs() {
  const [activeTab, setActiveTab] = useState<PropertyUnitTab>("residential");

  function selectTab(tab: PropertyUnitTab) {
    setActiveTab(tab);
  }

  return {
    activeTab,
    selectTab,
  };
}
