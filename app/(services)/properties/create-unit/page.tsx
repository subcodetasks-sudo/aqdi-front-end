import { getTranslations } from "next-intl/server";

import CreateUnitPageContent from "@/features/create-unit/components/create-unit-page-content";
import type { CreateUnitLabels } from "@/features/create-unit/types/create-unit-labels";
import {
  UNIT_TYPE_OPTIONS,
  UNIT_USAGE_OPTIONS,
} from "@/features/create-unit/types/unit-data";

export default async function CreateUnitPage() {
  const t = await getTranslations("createUnit");

  const labels: CreateUnitLabels = {
    backLabel: t("backLabel"),
    pageTitle: t("pageTitle"),
    navigation: {
      previous: t("navigation.previous"),
      continue: t("navigation.continue"),
    },
    title: t("title"),
    subtitle: t("subtitle"),
    selectPlaceholder: t("selectPlaceholder"),
    unitType: {
      label: t("unitType.label"),
      options: Object.fromEntries(
        UNIT_TYPE_OPTIONS.map((unitType) => [
          unitType,
          t(`unitType.options.${unitType}`),
        ]),
      ) as CreateUnitLabels["unitType"]["options"],
    },
    unitUsage: {
      label: t("unitUsage.label"),
      options: Object.fromEntries(
        UNIT_USAGE_OPTIONS.map((unitUsage) => [
          unitUsage,
          t(`unitUsage.options.${unitUsage}`),
        ]),
      ) as CreateUnitLabels["unitUsage"]["options"],
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
  };

  return <CreateUnitPageContent labels={labels} />;
}
