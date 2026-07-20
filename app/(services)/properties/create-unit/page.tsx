import { getTranslations } from "next-intl/server";

import CreateUnitPageContent from "@/features/create-unit/components/create-unit-page-content";
import { mapApiUnitToUnitData } from "@/features/create-unit/utils/map-api-unit-to-form";
import type { CreateUnitLabels } from "@/features/create-unit/types/create-unit-labels";
import type { UnitDataState } from "@/features/create-unit/types/unit-data";
import {
  parseUnitContractType,
  parseUnitPropertyId,
} from "@/features/create-unit/utils/contract-type";
import { getRealEstateShow } from "@/features/property-units/services/get-real-estate-show";
import type { PropertyContractType } from "@/features/create-property/utils/contract-type";

type CreateUnitPageProps = {
  searchParams: Promise<{
    propertyId?: string;
    contract_type?: string;
    type?: string;
    unitId?: string;
  }>;
};

function resolvePropertyContractType(
  value: PropertyContractType | null,
  fallback: PropertyContractType,
) {
  if (value === "housing" || value === "commercial") {
    return value;
  }

  return fallback;
}

export default async function CreateUnitPage({ searchParams }: CreateUnitPageProps) {
  const params = await searchParams;
  const propertyId = parseUnitPropertyId(params.propertyId);
  let contractType = parseUnitContractType(params.contract_type, params.type);
  let contractTypeLocked = false;
  const t = await getTranslations("createUnit");

  let initialUnits: UnitDataState[] | null = null;
  let hasExistingUnits = false;

  if (propertyId) {
    try {
      const property = await getRealEstateShow(propertyId);
      const units = property.units ?? [];

      if (units.length > 0) {
        initialUnits = units.map((unit) => mapApiUnitToUnitData(unit));
        hasExistingUnits = true;
      }

      contractType = resolvePropertyContractType(
        property.contract_type,
        contractType,
      );
      contractTypeLocked = hasExistingUnits;
    } catch {
      initialUnits = null;
      hasExistingUnits = false;
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
      hasExistingUnits={hasExistingUnits}
      initialUnits={initialUnits}
    />
  );
}
