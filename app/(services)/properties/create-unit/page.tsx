import { getTranslations } from "next-intl/server";

import CreateUnitPageContent from "@/features/create-unit/components/create-unit-page-content";
import { mapApiUnitToUnitData } from "@/features/create-unit/utils/map-api-unit-to-form";
import type { CreateUnitLabels } from "@/features/create-unit/types/create-unit-labels";
import type { UnitDataState } from "@/features/create-unit/types/unit-data";
import {
  parseUnitContractType,
  parseUnitId,
  parseUnitPropertyId,
} from "@/features/create-unit/utils/contract-type";
import { getPropertyUnits } from "@/features/property-units/services/get-property-units";

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
  const contractType = parseUnitContractType(params.contract_type, params.type);
  const t = await getTranslations("createUnit");

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
    roomsCount: {
      label: t("roomsCount.label"),
    },
    hallsCount: {
      label: t("hallsCount.label"),
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
      options: {
        housing: t("contractType.options.housing"),
        commercial: t("contractType.options.commercial"),
      },
    },
  };

  let initialUnitData: UnitDataState | null = null;

  if (propertyId && unitId) {
    try {
      const property = await getPropertyUnits(propertyId);
      const unit = property.units?.find((item) => item.id === unitId);

      if (unit) {
        initialUnitData = mapApiUnitToUnitData(unit);
      }
    } catch {
      initialUnitData = null;
    }
  }

  return (
    <CreateUnitPageContent
      labels={labels}
      propertyId={propertyId}
      contractType={contractType}
      unitId={unitId}
      initialUnitData={initialUnitData}
    />
  );
}
