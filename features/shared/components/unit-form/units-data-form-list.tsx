"use client";

import type { ReactNode } from "react";

import { EMPTY_UNIT_DATA, type UnitDataState } from "@/features/create-unit/types/unit-data";
import { cn } from "@/lib/utils";

type UnitsDataFormListProps = {
  addUnitLabel: string;
  removeUnitLabel?: string;
  unitsCountLabel: string;
  unitSectionTitle?: (index: number) => string;
  units: UnitDataState[];
  onUnitsChange: (units: UnitDataState[]) => void;
  renderUnitForm: (
    unit: UnitDataState,
    index: number,
    onChange: (unit: UnitDataState) => void,
  ) => ReactNode;
  allowAddUnit?: boolean;
  allowRemoveUnit?: boolean;
  minUnits?: number;
  className?: string;
};

export default function UnitsDataFormList({
  addUnitLabel,
  removeUnitLabel,
  unitsCountLabel,
  unitSectionTitle,
  units,
  onUnitsChange,
  renderUnitForm,
  allowAddUnit = true,
  allowRemoveUnit = false,
  minUnits = 1,
  className,
}: UnitsDataFormListProps) {
  function updateUnit(index: number, unit: UnitDataState) {
    onUnitsChange(units.map((current, currentIndex) => (currentIndex === index ? unit : current)));
  }

  function handleAddUnit() {
    onUnitsChange([...units, { ...EMPTY_UNIT_DATA }]);
  }

  function handleRemoveUnit(index: number) {
    if (units.length <= minUnits) {
      return;
    }

    onUnitsChange(units.filter((_, currentIndex) => currentIndex !== index));
  }

  return (
    <div className={cn("space-y-6", className)}>
      {units.map((unit, index) => (
        <div key={`unit-form-${unit.unitId ?? index}`} className="space-y-4">
          {unitSectionTitle || (allowRemoveUnit && units.length > minUnits) ? (
            <div className="flex items-center justify-between gap-3">
              {unitSectionTitle ? (
                <p className="text-sm font-extrabold text-brand">
                  {unitSectionTitle(index)}
                </p>
              ) : (
                <span />
              )}

              {allowRemoveUnit && units.length > minUnits ? (
                <button
                  type="button"
                  onClick={() => handleRemoveUnit(index)}
                  className="text-xs font-semibold text-[#c0392b] transition-colors hover:text-[#962d22]"
                >
                  {removeUnitLabel}
                </button>
              ) : null}
            </div>
          ) : null}

          {renderUnitForm(unit, index, (nextUnit) => updateUnit(index, nextUnit))}
        </div>
      ))}

      {allowAddUnit ? (
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleAddUnit}
            className="flex h-14 w-full items-center justify-center rounded-2xl border border-dashed border-brand bg-brand-background text-sm font-bold text-brand transition-colors hover:bg-[#eef6f3]"
          >
            + {addUnitLabel}
          </button>

          <p className="text-center text-xs text-[#7f7f7f]">
            {unitsCountLabel}: {units.length}
          </p>
        </div>
      ) : null}
    </div>
  );
}
