"use client";

import PropertyUnitCard from "@/features/property-units/components/property-unit-card";
import type { PropertyUnitCardData } from "@/features/property-units/types/property-unit";

type PropertyUnitsGridProps = {
  items: PropertyUnitCardData[];
  selectedUnitIds: number[];
  isStarting: boolean;
  onToggleUnit: (unitId: number, selected: boolean) => void;
  onCreateContract: (unit: PropertyUnitCardData) => void;
};

export default function PropertyUnitsGrid({
  items,
  selectedUnitIds,
  isStarting,
  onToggleUnit,
  onCreateContract,
}: PropertyUnitsGridProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {items.map((unit) => (
        <PropertyUnitCard
          key={unit.id}
          unit={unit}
          selected={selectedUnitIds.includes(unit.unitId)}
          onSelectedChange={(selected) => onToggleUnit(unit.unitId, selected)}
          isStarting={isStarting}
          onCreateContract={onCreateContract}
        />
      ))}
    </div>
  );
}
