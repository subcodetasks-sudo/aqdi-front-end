import { mapInstrumentTypeToDeedType } from "@/features/create-contract/utils/map-instrument-type-to-deed-type";
import {
  DEED_TYPES,
  type DeedTypeId,
} from "@/features/create-contract/types/deed-type";
import {
  PROPERTY_DEED_TYPES,
  type PropertyDeedTypeId,
} from "@/features/create-property/types/deed-type";
import type { SettingContractItem } from "@/features/shared/types/setting-contract";

export type SettingContractOption<TId extends string> = {
  id: TId;
  badgeLabel: string | null;
};

function resolvePropertyInstrumentType(
  instrumentType: string,
): PropertyDeedTypeId | null {
  if (PROPERTY_DEED_TYPES.includes(instrumentType as PropertyDeedTypeId)) {
    return instrumentType as PropertyDeedTypeId;
  }

  if (instrumentType === "electronic") {
    return "electronic_deed_from_the_ministry_of_justice";
  }

  return null;
}

export function resolvePropertySettingContractOptions(
  settings: SettingContractItem[] | undefined,
  selectedId: PropertyDeedTypeId | "" = "",
): SettingContractOption<PropertyDeedTypeId>[] {
  if (!settings) {
    return PROPERTY_DEED_TYPES.map((id) => ({ id, badgeLabel: null }));
  }

  const badgeById = new Map<PropertyDeedTypeId, string>();

  for (const item of settings) {
    if (!item.realestate) continue;

    const deedTypeId = resolvePropertyInstrumentType(item.instrument_type);
    if (!deedTypeId || badgeById.has(deedTypeId)) continue;

    badgeById.set(deedTypeId, item.label?.trim() || "");
  }

  return PROPERTY_DEED_TYPES.filter(
    (id) => badgeById.has(id) || id === selectedId,
  ).map((id) => ({
    id,
    badgeLabel: badgeById.get(id) || null,
  }));
}

export function resolveContractSettingContractOptions(
  settings: SettingContractItem[] | undefined,
  selectedId: DeedTypeId | "" = "",
): SettingContractOption<DeedTypeId>[] {
  if (!settings) {
    return DEED_TYPES.map((id) => ({ id, badgeLabel: null }));
  }

  const badgeById = new Map<DeedTypeId, string>();

  for (const item of settings) {
    if (!item.contract) continue;

    const deedTypeId = mapInstrumentTypeToDeedType(item.instrument_type);
    if (!deedTypeId || badgeById.has(deedTypeId)) continue;

    badgeById.set(deedTypeId, item.label?.trim() || "");
  }

  return DEED_TYPES.filter(
    (id) => badgeById.has(id) || id === selectedId,
  ).map((id) => ({
    id,
    badgeLabel: badgeById.get(id) || null,
  }));
}
