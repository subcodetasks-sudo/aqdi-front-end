"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";

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
  createUnitHref: string | null;
};

export default function PropertyUnitsTabs({
  labels,
  propertyId,
  activeTab,
  onTabChange,
  property,
  residentialItems,
  commercialItems,
  createUnitHref,
}: PropertyUnitsTabsProps) {
  const t = useTranslations("propertyUnits.card");
  const { startContract, isStarting, startingUnitIds } =
    useStartContractFromUnit();
  const [selectedUnitIds, setSelectedUnitIds] = useState<number[]>([]);

  const items =
    activeTab === "residential" ? residentialItems : commercialItems;
  const emptyMessage =
    activeTab === "residential"
      ? labels.emptyResidential
      : labels.emptyCommercial;
  const createUnitLabel =
    activeTab === "residential"
      ? labels.createResidentialUnit
      : labels.createCommercialUnit;

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

  return (
    <div className={cn("space-y-6", selectedUnitIds.length > 0 && "pb-28")}>
      <div className="w-fit max-w-full rounded-[28px] bg-white p-2 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleTabChange("residential")}
            className={cn(
              "rounded-[22px] px-6 py-3.5 text-sm font-extrabold transition-all md:px-8 md:text-base",
              activeTab === "residential"
                ? "bg-linear-to-br from-brand-secondary to-brand text-white shadow-sm"
                : "bg-transparent text-[#5a5a5a]",
            )}
          >
            {labels.tabs.residential}
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("commercial")}
            className={cn(
              "rounded-[22px] px-6 py-3.5 text-sm font-extrabold transition-all md:px-8 md:text-base",
              activeTab === "commercial"
                ? "bg-linear-to-br from-brand-secondary to-brand text-white shadow-sm"
                : "bg-transparent text-[#5a5a5a]",
            )}
          >
            {labels.tabs.commercial}
          </button>
        </div>
      </div>

      {!propertyId || items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-5 rounded-3xl border border-dashed border-[#e8e8e8] bg-white px-6 py-12 text-center">
          <p className="text-sm text-[#7a7a7a] md:text-base">{emptyMessage}</p>
          {createUnitHref ? (
            <Link
              href={createUnitHref}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#f3f3f3] px-5 py-3 text-sm font-bold text-brand transition-colors hover:bg-[#ececec]"
            >
              <Plus className="size-4 shrink-0" strokeWidth={2.5} aria-hidden="true" />
              <span>{createUnitLabel}</span>
            </Link>
          ) : null}
        </div>
      ) : (
        <PropertyUnitsGrid
          items={items}
          selectedUnitIds={selectedUnitIds}
          isStarting={isStarting}
          startingUnitIds={startingUnitIds}
          onToggleUnit={handleToggleUnit}
          onCreateContract={(unit) => void handleCreateFromUnits([unit])}
        />
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
