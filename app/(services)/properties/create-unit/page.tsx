import { getTranslations } from "next-intl/server";

import CreateUnitPageContent from "@/features/create-unit/components/create-unit-page-content";
import { getUnitTypes } from "@/features/create-unit/services/get-unit-types";
import { getUnitUsageOptions } from "@/features/create-unit/services/get-unit-usage";
import { mapApiUnitToUnitData } from "@/features/create-unit/utils/map-api-unit-to-form";
import type { CreateUnitLabels } from "@/features/create-unit/types/create-unit-labels";
import type { UnitDataState } from "@/features/create-unit/types/unit-data";
import {
  parseUnitContractType,
  parseUnitId,
  parseUnitPropertyId,
} from "@/features/create-unit/utils/contract-type";
import { getRealEstateShow } from "@/features/property-units/services/get-real-estate-show";
import { resolveUnitContractType } from "@/features/property-units/utils/map-property-units";

type CreateUnitPageProps = {
  searchParams: Promise<{
    propertyId?: string;
    contract_type?: string;
    type?: string;
    unitId?: string;
  }>;
};

export default async function CreateUnitPage({ searchParams }: CreateUnitPageProps) {
  const params = await searchParams;
  const propertyId = parseUnitPropertyId(params.propertyId);
  const unitId = parseUnitId(params.unitId);
  const urlContractType = parseUnitContractType(params.contract_type, params.type);
  const urlHasExplicitContractType =
    params.contract_type === "commercial" ||
    params.contract_type === "housing" ||
    params.type === "commercial" ||
    params.type === "residential";

  const contractType = urlContractType;
  const contractTypeLocked = urlHasExplicitContractType || unitId !== null;
  const t = await getTranslations("createUnit");

  let initialUnits: UnitDataState[] | null = null;
  let preservedUnits: UnitDataState[] = [];
  let propertyHasUnits = false;
  const isEditMode = unitId !== null;

  if (propertyId) {
    try {
      const property = await getRealEstateShow(propertyId);
      const units = property.units ?? [];
      propertyHasUnits = units.length > 0;

      const fallbackContractType =
        property.contract_type === "commercial" ||
        property.contract_type === "housing"
          ? property.contract_type
          : contractType;

      const [
        housingTypes,
        housingUsages,
        commercialTypes,
        commercialUsages,
      ] = await Promise.all([
        getUnitTypes("housing"),
        getUnitUsageOptions("housing"),
        getUnitTypes("commercial"),
        getUnitUsageOptions("commercial"),
      ]);

      const lookups = {
        housing: { types: housingTypes, usages: housingUsages },
        commercial: { types: commercialTypes, usages: commercialUsages },
      };

      const unitsOfSelectedType = units.filter(
        (unit) =>
          resolveUnitContractType(unit, fallbackContractType, lookups) ===
          contractType,
      );
      const unitsOfOtherType = units.filter(
        (unit) =>
          resolveUnitContractType(unit, fallbackContractType, lookups) !==
          contractType,
      );

      preservedUnits = unitsOfOtherType.map((unit) =>
        mapApiUnitToUnitData(
          unit,
          resolveUnitContractType(unit, fallbackContractType, lookups),
        ),
      );

      if (isEditMode) {
        initialUnits =
          unitsOfSelectedType.length > 0
            ? unitsOfSelectedType.map((unit) =>
                mapApiUnitToUnitData(
                  unit,
                  resolveUnitContractType(unit, fallbackContractType, lookups),
                ),
              )
            : null;
      }
    } catch {
      initialUnits = null;
      preservedUnits = [];
      propertyHasUnits = false;
    }
  }

  const labels: CreateUnitLabels = {
    backLabel: t("backLabel"),
    pageTitle: t("pageTitle"),
    editPageTitle: t("editPageTitle"),
    navigation: {
      previous: t("navigation.previous"),
      continue: t("navigation.continue"),
      save: t("navigation.save"),
      submitting: t("navigation.submitting"),
      submitError: t("navigation.submitError"),
      updateSuccess: t("navigation.updateSuccess"),
      createSuccess: t("navigation.createSuccess"),
    },
    title: t("title"),
    editTitle: t("editTitle"),
    subtitle: t("subtitle"),
    editSubtitle: t("editSubtitle"),
    selectPlaceholder: t("selectPlaceholder"),
    unitType: {
      label: t("unitType.label"),
    },
    unitUsage: {
      label: t("unitUsage.label"),
    },
    totalArea: {
      label: t("totalArea.label"),
      placeholder: t("totalArea.placeholder"),
      suffix: t("totalArea.suffix"),
    },
    floorNumber: {
      label: t("floorNumber.label"),
    },
    floorOptions: {
      ground: t("floorOptions.ground"),
    },
    unitNumber: {
      label: t("unitNumber.label"),
      placeholder: t("unitNumber.placeholder"),
    },
    unitCardTitle: t("unitCardTitle"),
    addUnit: t("addUnit"),
    removeUnit: t("removeUnit"),
    unitsCount: t("unitsCount"),
    unitListTitle: t("unitListTitle"),
    floorSummaryPrefix: t("floorSummaryPrefix"),
    additionalInfo: {
      toggle: t("additionalInfo.toggle"),
      writeHerePlaceholder: t("additionalInfo.writeHerePlaceholder"),
    },
    roomsCount: {
      label: t("roomsCount.label"),
      hint: t("roomsCount.hint"),
    },
    hallsCount: {
      label: t("hallsCount.label"),
    },
    majlisCount: {
      label: t("majlisCount.label"),
    },
    kitchensCount: {
      label: t("kitchensCount.label"),
    },
    bathroomsCount: {
      label: t("bathroomsCount.label"),
    },
    windowAcCount: {
      label: t("windowAcCount.label"),
    },
    splitAcCount: {
      label: t("splitAcCount.label"),
    },
    kitchenCabinetsInstalled: {
      label: t("kitchenCabinetsInstalled.label"),
      kitchensRequiredHint: t("kitchenCabinetsInstalled.kitchensRequiredHint"),
    },
    furnished: {
      label: t("furnished.label"),
    },
    furnishingType: {
      label: t("furnishingType.label"),
      new: t("furnishingType.new"),
      used: t("furnishingType.used"),
    },
    addElectricityMeter: {
      label: t("addElectricityMeter.label"),
    },
    electricityMeterNumber: {
      label: t("electricityMeterNumber.label"),
      placeholder: t("electricityMeterNumber.placeholder"),
    },
    addWaterMeter: {
      label: t("addWaterMeter.label"),
    },
    waterMeterNumber: {
      label: t("waterMeterNumber.label"),
      placeholder: t("waterMeterNumber.placeholder"),
    },
    success: {
      title: t("success.title"),
      description: t("success.description"),
      mainMenu: t("success.mainMenu"),
      mainMenuHref: t("success.mainMenuHref"),
      actions: {
        viewProperty: t("success.actions.viewProperty"),
        viewPropertyHref: t("success.actions.viewPropertyHref"),
        addUnit: t("success.actions.addUnit"),
        addUnitHref: t("success.actions.addUnitHref"),
        createContract: t("success.actions.createContract"),
        createContractHref: t("success.actions.createContractHref"),
        ejarLogoAlt: t("success.actions.ejarLogoAlt"),
      },
    },
    contractType: {
      label: t("contractType.label"),
      linkedLabel: t("contractType.linkedLabel"),
      options: {
        housing: t("contractType.options.housing"),
        commercial: t("contractType.options.commercial"),
      },
    },
  };

  return (
    <CreateUnitPageContent
      labels={labels}
      propertyId={propertyId}
      contractType={contractType}
      contractTypeLocked={contractTypeLocked}
      isEditMode={isEditMode}
      propertyHasUnits={propertyHasUnits}
      initialUnits={initialUnits}
      preservedUnits={preservedUnits}
    />
  );
}
