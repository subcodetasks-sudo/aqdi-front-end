"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { useStartContractFromUnit } from "@/features/create-contract/hooks/use-start-contract-from-unit";
import PropertyUnitsGrid from "@/features/property-units/components/property-units-grid";
import PropertyUnitsSelectionBar from "@/features/property-units/components/property-units-selection-bar";
import type {
  PropertyUnitCardData,
  PropertyUnitTab,
} from "@/features/property-units/types/property-unit";
import type { PropertyWithUnitsApiData } from "@/features/property-units/types/property-units-api";
import type { PropertyUnitsLabels } from "@/features/property-units/types/property-units-labels";
import { cn } from "@/lib/utils";

type PropertyUnitsTabsProps = {
  labels: PropertyUnitsLabels;
  propertyId: number | null;
  activeTab: PropertyUnitTab;
  onTabChange: (tab: PropertyUnitTab) => void;
  property: PropertyWithUnitsApiData | null;
  residentialItems: PropertyUnitCardData[];
  commercialItems: PropertyUnitCardData[];
};

export default function PropertyUnitsTabs({
  labels,
  propertyId,
  activeTab,
  onTabChange,
  property,
  residentialItems,
  commercialItems,
}: PropertyUnitsTabsProps) {
  const t = useTranslations("propertyUnits.card");
  const { startContract, isStarting } = useStartContractFromUnit();
  const [selectedUnitIds, setSelectedUnitIds] = useState<number[]>([]);

  const items =
    activeTab === "residential" ? residentialItems : commercialItems;

  useEffect(() => {
    setSelectedUnitIds([]);
  }, [activeTab, propertyId]);

  function handleTabChange(tab: PropertyUnitTab) {
    setSelectedUnitIds([]);
    onTabChange(tab);
  }

  function handleToggleUnit(unitId: number, selected: boolean) {
    setSelectedUnitIds((current) => {
      if (selected) {
        return current.includes(unitId) ? current : [...current, unitId];
      }

      return current.filter((id) => id !== unitId);
    });
  }

  async function handleCreateFromUnits(units: PropertyUnitCardData[]) {
    if (!property) {
      toast.error(t("startContractError"));
      return;
    }

    await startContract(units, property);
  }

  async function handleCreateFromSelection() {
    const selectedUnits = items.filter((unit) =>
      selectedUnitIds.includes(unit.unitId),
    );

    await handleCreateFromUnits(selectedUnits);
  }

  if (!propertyId) {
    return (
      <p className="rounded-3xl border border-dashed border-[#e8e8e8] bg-white px-6 py-12 text-center text-sm text-muted-foreground">
        {labels.emptyState}
      </p>
    );
  }

  return (
    <div className={cn("space-y-6", selectedUnitIds.length > 0 && "pb-28")}>
      <div className="rounded-[28px] bg-brand-background p-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleTabChange("residential")}
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
            onClick={() => handleTabChange("commercial")}
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
        <PropertyUnitsGrid
          items={items}
          selectedUnitIds={selectedUnitIds}
          isStarting={isStarting}
          onToggleUnit={handleToggleUnit}
          onCreateContract={(unit) => void handleCreateFromUnits([unit])}
        />
      ) : (
        <p className="rounded-3xl border border-dashed border-[#e8e8e8] bg-white px-6 py-12 text-center text-sm text-muted-foreground">
          {labels.emptyState}
        </p>
      )}

      <PropertyUnitsSelectionBar
        count={selectedUnitIds.length}
        activeTab={activeTab}
        isStarting={isStarting}
        onCancel={() => setSelectedUnitIds([])}
        onCreateContract={() => void handleCreateFromSelection()}
      />
    </div>
  );
}
