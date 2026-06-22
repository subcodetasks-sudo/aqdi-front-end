import { getTranslations } from "next-intl/server";

import CreateContractPageContent from "@/features/create-contract/components/create-contract-page-content";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import type { ContractTypeId } from "@/features/create-contract/types/contract-type";
import { DEED_TYPES } from "@/features/create-contract/types/deed-type";

type CreateContractPageProps = {
  searchParams: Promise<{ id?: string }>;
};

export default async function CreateContractPage({
  searchParams,
}: CreateContractPageProps) {
  const { id } = await searchParams;
  const t = await getTranslations("createContract");

  const contractType: ContractTypeId =
    id === "residential" ? "residential" : "commercial";

  const labels: CreateContractLabels = {
    backLabel: t("backLabel"),
    pageTitleResidential: t("pageTitleResidential"),
    pageTitleCommercial: t("pageTitleCommercial"),
    stepper: {
      journey: t("stepper.journey"),
      ejarLogoAlt: t("stepper.ejarLogoAlt"),
      steps: {
        intro: t("stepper.steps.intro"),
        deed: t("stepper.steps.deed"),
        owner: t("stepper.steps.owner"),
        tenant: t("stepper.steps.tenant"),
        finance: t("stepper.steps.finance"),
      },
    },
    intro: {
      title: t("intro.title"),
      subtitle: t("intro.subtitle"),
      requirements: t.raw("intro.requirements") as string[],
      priceLabel: t("intro.priceLabel"),
      currency: t("intro.currency"),
      viewAllPrices: t("intro.viewAllPrices"),
      start: t("intro.start"),
      priceDialog: {
        title: t("intro.priceDialog.title"),
        close: t("intro.priceDialog.close"),
        yearOrLess: t("intro.priceDialog.yearOrLess", {
          price: t(`prices.${contractType}`),
        }),
        additionalYear: t("intro.priceDialog.additionalYear", {
          price: t("prices.additionalYear"),
        }),
        disclaimer: t("intro.priceDialog.disclaimer"),
      },
    },
    deed: {
      navigation: {
        previous: t("deed.navigation.previous"),
        continue: t("deed.navigation.continue"),
      },
      phases: t.raw("deed.phases") as CreateContractLabels["deed"]["phases"],
      deedType: {
        label: t("deed.deedType.label"),
        placeholder: t("deed.deedType.placeholder"),
        clearSelection: t("deed.deedType.clearSelection"),
        types: Object.fromEntries(
          DEED_TYPES.map((deedType) => [
            deedType,
            t(`deed.deedType.types.${deedType}`),
          ]),
        ) as CreateContractLabels["deed"]["deedType"]["types"],
      },
      deedImage: {
        label: t("deed.deedImage.label"),
        clickHere: t("deed.deedImage.clickHere"),
        chooseFile: t("deed.deedImage.chooseFile"),
        acceptedFormats: t("deed.deedImage.acceptedFormats"),
        preview: t("deed.deedImage.preview"),
        delete: t("deed.deedImage.delete"),
        previewTitle: t("deed.deedImage.previewTitle"),
        closePreview: t("deed.deedImage.closePreview"),
      },
      propertyDetails: {
        propertyType: {
          label: t("deed.propertyDetails.propertyType.label"),
          placeholder: t("deed.propertyDetails.propertyType.placeholder"),
          options: t.raw(
            "deed.propertyDetails.propertyType.options",
          ) as CreateContractLabels["deed"]["propertyDetails"]["propertyType"]["options"],
        },
        propertyUse: {
          label: t("deed.propertyDetails.propertyUse.label"),
          placeholder: t("deed.propertyDetails.propertyUse.placeholder"),
          options: t.raw(
            "deed.propertyDetails.propertyUse.options",
          ) as CreateContractLabels["deed"]["propertyDetails"]["propertyUse"]["options"],
        },
        propertyAge: {
          label: t("deed.propertyDetails.propertyAge.label"),
          placeholder: t("deed.propertyDetails.propertyAge.placeholder"),
          options: t.raw(
            "deed.propertyDetails.propertyAge.options",
          ) as CreateContractLabels["deed"]["propertyDetails"]["propertyAge"]["options"],
        },
        floorCount: {
          label: t("deed.propertyDetails.floorCount.label"),
          placeholder: t("deed.propertyDetails.floorCount.placeholder"),
          options: t.raw(
            "deed.propertyDetails.floorCount.options",
          ) as CreateContractLabels["deed"]["propertyDetails"]["floorCount"]["options"],
        },
        unitsPerFloor: {
          label: t("deed.propertyDetails.unitsPerFloor.label"),
          placeholder: t("deed.propertyDetails.unitsPerFloor.placeholder"),
          options: t.raw(
            "deed.propertyDetails.unitsPerFloor.options",
          ) as CreateContractLabels["deed"]["propertyDetails"]["unitsPerFloor"]["options"],
        },
        totalUnits: {
          label: t("deed.propertyDetails.totalUnits.label"),
          placeholder: t("deed.propertyDetails.totalUnits.placeholder"),
          options: t.raw(
            "deed.propertyDetails.totalUnits.options",
          ) as CreateContractLabels["deed"]["propertyDetails"]["totalUnits"]["options"],
        },
      },
      nationalAddress: {
        methods: t.raw("deed.nationalAddress.methods") as string[],
        mapTitle: t("deed.nationalAddress.mapTitle"),
        link: {
          label: t("deed.nationalAddress.link.label"),
          placeholder: t("deed.nationalAddress.link.placeholder"),
        },
        photo: {
          label: t("deed.nationalAddress.photo.label"),
          clickHere: t("deed.nationalAddress.photo.clickHere"),
          chooseFile: t("deed.nationalAddress.photo.chooseFile"),
          acceptedFormats: t("deed.nationalAddress.photo.acceptedFormats"),
          preview: t("deed.nationalAddress.photo.preview"),
          delete: t("deed.nationalAddress.photo.delete"),
          previewTitle: t("deed.nationalAddress.photo.previewTitle"),
          closePreview: t("deed.nationalAddress.photo.closePreview"),
        },
      },
    },
    prices: {
      residential: t("prices.residential"),
      commercial: t("prices.commercial"),
      additionalYear: t("prices.additionalYear"),
    },
  };

  return (
    <CreateContractPageContent labels={labels} contractType={contractType} />
  );
}
