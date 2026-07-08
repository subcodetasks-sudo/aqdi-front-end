"use client";

import PropertyUnitsGrid from "@/features/property-units/components/property-units-grid";
import { usePropertyUnitsTabs } from "@/features/property-units/hooks/use-property-units-tabs";
import type { PropertyUnitTab } from "@/features/property-units/types/property-unit";
import type { PropertyUnitCardData } from "@/features/property-units/types/property-unit";
import type { PropertyWithUnitsApiData } from "@/features/property-units/types/property-units-api";
import type { PropertyUnitsLabels } from "@/features/property-units/types/property-units-labels";
import { cn } from "@/lib/utils";

type PropertyUnitsTabsProps = {
  labels: PropertyUnitsLabels;
  propertyId: number | null;
  initialTab: PropertyUnitTab;
  property: PropertyWithUnitsApiData | null;
  residentialItems: PropertyUnitCardData[];
  commercialItems: PropertyUnitCardData[];
};

export default function PropertyUnitsTabs({
  labels,
  propertyId,
  initialTab,
  property,
  residentialItems,
  commercialItems,
}: PropertyUnitsTabsProps) {
  const { activeTab, selectTab } = usePropertyUnitsTabs(initialTab);

  const items =
    activeTab === "residential" ? residentialItems : commercialItems;

  if (!propertyId) {
    return (
      <p className="rounded-3xl border border-dashed border-[#e8e8e8] bg-white px-6 py-12 text-center text-sm text-muted-foreground">
        {labels.emptyState}
      </p>
    );
  }

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

      {items.length > 0 ? (
        <PropertyUnitsGrid items={items} property={property} />
      ) : (
        <p className="rounded-3xl border border-dashed border-[#e8e8e8] bg-white px-6 py-12 text-center text-sm text-muted-foreground">
          {labels.emptyState}
        </p>
      )}
    </div>
  );
}
