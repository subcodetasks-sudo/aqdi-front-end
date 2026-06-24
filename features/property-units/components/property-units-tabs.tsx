"use client";

import PropertyUnitsGrid from "@/features/property-units/components/property-units-grid";
import { usePropertyUnitsTabs } from "@/features/property-units/hooks/use-property-units-tabs";
import type { PropertyUnitsLabels } from "@/features/property-units/types/property-units-labels";
import { cn } from "@/lib/utils";

type PropertyUnitsTabsProps = {
  labels: PropertyUnitsLabels;
};

export default function PropertyUnitsTabs({ labels }: PropertyUnitsTabsProps) {
  const { activeTab, selectTab } = usePropertyUnitsTabs();

  const items =
    activeTab === "residential"
      ? labels.residentialItems
      : labels.commercialItems;

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] bg-brand-background p-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => selectTab("residential")}
            className={cn(
              "rounded-[22px] py-4 text-sm font-extrabold transition-colors md:text-base",
              activeTab === "residential"
                ? "bg-brand text-white"
                : "bg-white text-[#bdbdbd]",
            )}
          >
            {labels.tabs.residential}
          </button>
          <button
            type="button"
            onClick={() => selectTab("commercial")}
            className={cn(
              "rounded-[22px] py-4 text-sm font-extrabold transition-colors md:text-base",
              activeTab === "commercial"
                ? "bg-brand text-white"
                : "bg-white text-[#bdbdbd]",
            )}
          >
            {labels.tabs.commercial}
          </button>
        </div>
      </div>

      <PropertyUnitsGrid items={items} />
    </div>
  );
}
