import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";

import CreatePropertyPageContent from "@/features/create-property/components/create-property-page-content";
import type { CreatePropertyLabels } from "@/features/create-property/types/create-property-labels";
import { PROPERTY_DEED_TYPES } from "@/features/create-property/types/deed-type";
import { propertyLookupKeys } from "@/features/create-property/query-keys";
import { getRealEstateTypes } from "@/features/create-property/services/get-real-estate-types";
import { getRealEstateUsages } from "@/features/create-property/services/get-real-estate-usages";
import { toPropertyContractType } from "@/features/create-property/utils/contract-type";
import { mapPropertyApiToEditDraft } from "@/features/create-property/utils/map-property-api-to-draft";
import { parsePropertyId } from "@/features/create-property/utils/parse-property-id";
import { parsePropertyType } from "@/features/properties/types/property-type";
import { getRealEstateShow } from "@/features/property-units/services/get-real-estate-show";
import { settingContractsKeys } from "@/features/shared/query-keys";
import { getSettingContracts } from "@/features/shared/services/get-setting-contracts";
import { getQueryClient } from "@/lib/react-query/get-query-client";

type CreatePropertyPageProps = {
  searchParams: Promise<{ type?: string; propertyId?: string }>;
};

export default async function CreatePropertyPage({
  searchParams,
}: CreatePropertyPageProps) {
  const { type, propertyId: propertyIdParam } = await searchParams;
  const propertyType = parsePropertyType(type);
  const contractType = toPropertyContractType(propertyType);
  const propertyId = parsePropertyId(propertyIdParam);
  const queryClient = getQueryClient();

  const [t, , property] = await Promise.all([
    getTranslations("createProperty"),
    Promise.all([
      queryClient.prefetchQuery({
        queryKey: settingContractsKeys.list(),
        queryFn: () => getSettingContracts(),
      }),
      queryClient.prefetchQuery({
        queryKey: propertyLookupKeys.types(contractType),
        queryFn: () => getRealEstateTypes(contractType),
      }),
      queryClient.prefetchQuery({
        queryKey: propertyLookupKeys.usages(contractType),
        queryFn: () => getRealEstateUsages(contractType),
      }),
    ]),
    // `/realstate/show` returns the full property (including secondary deed
    // documents). `/realstate/units` often only has `image_instrument`.
    propertyId
      ? getRealEstateShow(propertyId).catch(() => null)
      : Promise.resolve(null),
  ]);

  const labels: CreatePropertyLabels = {
    backLabel: t("backLabel"),
    pageTitle: t("pageTitle"),
    pageTitleResidential: t("pageTitleResidential"),
    pageTitleCommercial: t("pageTitleCommercial"),
    editPageTitleResidential: t("editPageTitleResidential"),
    editPageTitleCommercial: t("editPageTitleCommercial"),
    header: {
      home: t("header.home"),
      dark: t("header.dark"),
      light: t("header.light"),
    },
    stepper: {
      journey: t("stepper.journey"),
      saveAlt: t("stepper.saveAlt"),
      brand: t("stepper.brand"),
      steps: {
        deed: t("stepper.steps.deed"),
        owner: t("stepper.steps.owner"),
        agent: t("stepper.steps.agent"),
        review: t("stepper.steps.review"),
      },
    },
    deed: {
      navigation: {
        previous: t("deed.navigation.previous"),
        continue: t("deed.navigation.continue"),
      },
      title: t("deed.title"),
      subtitle: t("deed.subtitle"),
      deedType: {
        label: t("deed.deedType.label"),
        placeholder: t("deed.deedType.placeholder"),
        clearSelection: t("deed.deedType.clearSelection"),
        types: Object.fromEntries(
          PROPERTY_DEED_TYPES.map((deedType) => [
            deedType,
            t(`deed.deedType.types.${deedType}`),
          ]),
        ) as CreatePropertyLabels["deed"]["deedType"]["types"],
      },
      deedImage: {
        label: t("deed.deedImage.label"),
        frontLabel: t("deed.deedImage.frontLabel"),
        backLabel: t("deed.deedImage.backLabel"),
        inheritanceLabel: t("deed.deedImage.inheritanceLabel"),
        heirsPoaLabel: t("deed.deedImage.heirsPoaLabel"),
        endowmentCertLabel: t("deed.deedImage.endowmentCertLabel"),
        trusteeshipLabel: t("deed.deedImage.trusteeshipLabel"),
        guardiansPoaLabel: t("deed.deedImage.guardiansPoaLabel"),
        salePaperLabel: t("deed.deedImage.salePaperLabel"),
        adversePossessionLabel: t("deed.deedImage.adversePossessionLabel"),
        economicCitiesLabel: t("deed.deedImage.economicCitiesLabel"),
        paperLabel: t("deed.deedImage.paperLabel"),
        clickHere: t("deed.deedImage.clickHere"),
        chooseFile: t("deed.deedImage.chooseFile"),
        acceptedFormats: t("deed.deedImage.acceptedFormats"),
        attached: t("deed.deedImage.attached"),
        preview: t("deed.deedImage.preview"),
        change: t("deed.deedImage.change"),
        delete: t("deed.deedImage.delete"),
        previewTitle: t("deed.deedImage.previewTitle"),
        closePreview: t("deed.deedImage.closePreview"),
      },
      waqf: {
        multipleTrusteesLabel: t("deed.waqf.multipleTrusteesLabel"),
        trusteesPoaHint: t("deed.waqf.trusteesPoaHint"),
      },
      deceased: {
        deedLabel: t("deed.deceased.deedLabel"),
        inheritanceLabel: t("deed.deceased.inheritanceLabel"),
        heirsPoaLabel: t("deed.deceased.heirsPoaLabel"),
        najizHint: t("deed.deceased.najizHint"),
        minorHeirsLabel: t("deed.deceased.minorHeirsLabel"),
        guardiansPoaLabel: t("deed.deceased.guardiansPoaLabel"),
        guardiansPoaHint: t("deed.deceased.guardiansPoaHint"),
        clickHere: t("deed.deceased.clickHere"),
        chooseFile: t("deed.deceased.chooseFile"),
      },
      propertyDetails: {
        title: t("deed.propertyDetails.title"),
        subtitle: t("deed.propertyDetails.subtitle"),
        propertyType: {
          label: t("deed.propertyDetails.propertyType.label"),
          placeholder: t("deed.propertyDetails.propertyType.placeholder"),
          loading: t("deed.propertyDetails.propertyType.loading"),
        },
        propertyUsage: {
          label: t("deed.propertyDetails.propertyUsage.label"),
          placeholder: t("deed.propertyDetails.propertyUsage.placeholder"),
          loading: t("deed.propertyDetails.propertyUsage.loading"),
        },
        numberOfFloors: {
          label: t("deed.propertyDetails.numberOfFloors.label"),
          placeholder: t("deed.propertyDetails.numberOfFloors.placeholder"),
        },
        numberOfUnits: {
          label: t("deed.propertyDetails.numberOfUnits.label"),
          placeholder: t("deed.propertyDetails.numberOfUnits.placeholder"),
        },
        unitsPerFloor: {
          label: t("deed.propertyDetails.unitsPerFloor.label"),
          placeholder: t("deed.propertyDetails.unitsPerFloor.placeholder"),
        },
        propertyAge: {
          label: t("deed.propertyDetails.propertyAge.label"),
          placeholder: t("deed.propertyDetails.propertyAge.placeholder"),
        },
        electricityOwnership: {
          label: t("deed.propertyDetails.electricityOwnership.label"),
          placeholder: t("deed.propertyDetails.electricityOwnership.placeholder"),
        },
        waterOwnership: {
          label: t("deed.propertyDetails.waterOwnership.label"),
          placeholder: t("deed.propertyDetails.waterOwnership.placeholder"),
        },
        ownership: {
          owner: t("deed.propertyDetails.ownership.owner"),
          tenant: t("deed.propertyDetails.ownership.tenant"),
        },
        registryNumber: {
          label: t("deed.propertyDetails.registryNumber.label"),
          placeholder: t("deed.propertyDetails.registryNumber.placeholder"),
        },
        registryDate: {
          label: t("deed.propertyDetails.registryDate.label"),
          day: t("deed.propertyDetails.registryDate.day"),
          month: t("deed.propertyDetails.registryDate.month"),
          year: t("deed.propertyDetails.registryDate.year"),
          dayPlaceholder: t("deed.propertyDetails.registryDate.dayPlaceholder"),
          monthPlaceholder: t(
            "deed.propertyDetails.registryDate.monthPlaceholder",
          ),
          yearPlaceholder: t(
            "deed.propertyDetails.registryDate.yearPlaceholder",
          ),
        },
      },
      manualEntry: {
        separator: t("deed.manualEntry.separator"),
        toggleLabel: t("deed.manualEntry.toggleLabel"),
        instrumentNumber: {
          label: t("deed.manualEntry.instrumentNumber.label"),
          placeholder: t("deed.manualEntry.instrumentNumber.placeholder"),
          hint: t("deed.manualEntry.instrumentNumber.hint"),
        },
        instrumentDate: {
          label: t("deed.manualEntry.instrumentDate.label"),
          hijri: t("deed.manualEntry.instrumentDate.hijri"),
          gregorian: t("deed.manualEntry.instrumentDate.gregorian"),
          day: t("deed.manualEntry.instrumentDate.day"),
          month: t("deed.manualEntry.instrumentDate.month"),
          year: t("deed.manualEntry.instrumentDate.year"),
          dayPlaceholder: t("deed.manualEntry.instrumentDate.dayPlaceholder"),
          monthPlaceholder: t("deed.manualEntry.instrumentDate.monthPlaceholder"),
          yearPlaceholder: t("deed.manualEntry.instrumentDate.yearPlaceholder"),
        },
      },
    },
    address: {
      navigation: {
        previous: t("address.navigation.previous"),
        continue: t("address.navigation.continue"),
        submitting: t("address.navigation.submitting"),
        submitError: t("address.navigation.submitError"),
      },
      title: t("address.title"),
      subtitle: t("address.subtitle"),
      nationalAddress: {
        methodSelect: {
          label: t("address.nationalAddress.methodSelect.label"),
          placeholder: t("address.nationalAddress.methodSelect.placeholder"),
        },
        methods: t.raw("address.nationalAddress.methods") as Record<
          "photo" | "link" | "manual",
          {
            title: string;
            description: string;
          }
        >,
        mapTitle: t("address.nationalAddress.mapTitle"),
        mapHint: t("address.nationalAddress.mapHint"),
        coordinatesLabel: t("address.nationalAddress.coordinatesLabel"),
        link: {
          label: t("address.nationalAddress.link.label"),
          placeholder: t("address.nationalAddress.link.placeholder"),
          hint: t("address.nationalAddress.link.hint"),
        },
        manual: {
          place: {
            label: t("address.nationalAddress.manual.place.label"),
            placeholder: t("address.nationalAddress.manual.place.placeholder"),
            loading: t("address.nationalAddress.manual.place.loading"),
          },
          city: {
            label: t("address.nationalAddress.manual.city.label"),
            placeholder: t("address.nationalAddress.manual.city.placeholder"),
            loading: t("address.nationalAddress.manual.city.loading"),
            selectPlaceFirst: t(
              "address.nationalAddress.manual.city.selectPlaceFirst",
            ),
          },
          neighborhood: {
            label: t("address.nationalAddress.manual.neighborhood.label"),
            placeholder: t(
              "address.nationalAddress.manual.neighborhood.placeholder",
            ),
          },
          street: {
            label: t("address.nationalAddress.manual.street.label"),
            placeholder: t("address.nationalAddress.manual.street.placeholder"),
          },
          buildingNumber: {
            label: t("address.nationalAddress.manual.buildingNumber.label"),
            placeholder: t(
              "address.nationalAddress.manual.buildingNumber.placeholder",
            ),
          },
          postalCode: {
            label: t("address.nationalAddress.manual.postalCode.label"),
            placeholder: t(
              "address.nationalAddress.manual.postalCode.placeholder",
            ),
          },
          extraFigure: {
            label: t("address.nationalAddress.manual.extraFigure.label"),
            placeholder: t(
              "address.nationalAddress.manual.extraFigure.placeholder",
            ),
          },
        },
        photo: {
          label: t("address.nationalAddress.photo.label"),
          clickHere: t("address.nationalAddress.photo.clickHere"),
          chooseFile: t("address.nationalAddress.photo.chooseFile"),
          acceptedFormats: t("address.nationalAddress.photo.acceptedFormats"),
          hint: t("address.nationalAddress.photo.hint"),
          attached: t("address.nationalAddress.photo.attached"),
          preview: t("address.nationalAddress.photo.preview"),
          change: t("address.nationalAddress.photo.change"),
          delete: t("address.nationalAddress.photo.delete"),
          previewTitle: t("address.nationalAddress.photo.previewTitle"),
          closePreview: t("address.nationalAddress.photo.closePreview"),
        },
      },
    },
    owner: {
      navigation: {
        previous: t("owner.navigation.previous"),
        continue: t("owner.navigation.continue"),
      },
      validation: {
        hintTitle: t("owner.validation.hintTitle"),
        issues: t.raw("owner.validation.issues") as CreatePropertyLabels["owner"]["validation"]["issues"],
        fieldErrors: {
          idNumberLength: t("owner.validation.fieldErrors.idNumberLength"),
          phoneLength: t("owner.validation.fieldErrors.phoneLength"),
          iban: t("owner.validation.fieldErrors.iban"),
        },
      },
      phases: t.raw("owner.phases") as CreatePropertyLabels["owner"]["phases"],
      birthDate: {
        label: t("owner.birthDate.label"),
        hijri: t("owner.birthDate.hijri"),
        gregorian: t("owner.birthDate.gregorian"),
        day: t("owner.birthDate.day"),
        month: t("owner.birthDate.month"),
        year: t("owner.birthDate.year"),
        dayPlaceholder: t("owner.birthDate.dayPlaceholder"),
        monthPlaceholder: t("owner.birthDate.monthPlaceholder"),
        yearPlaceholder: t("owner.birthDate.yearPlaceholder"),
      },
      ownerData: {
        idNumber: {
          label: t("owner.ownerData.idNumber.label"),
          placeholder: t("owner.ownerData.idNumber.placeholder"),
        },
        phone: {
          label: t("owner.ownerData.phone.label"),
          placeholder: t("owner.ownerData.phone.placeholder"),
        },
        iban: {
          label: t("owner.ownerData.iban.label"),
          placeholder: t("owner.ownerData.iban.placeholder"),
        },
        hasAgent: {
          title: t("owner.ownerData.hasAgent.title"),
          description: t("owner.ownerData.hasAgent.description"),
        },
      },
      agentData: {
        sectionTitle: t("owner.agentData.sectionTitle"),
        sectionDescription: t("owner.agentData.sectionDescription"),
        footerNote: t("owner.agentData.footerNote"),
        idNumber: {
          label: t("owner.agentData.idNumber.label"),
          placeholder: t("owner.agentData.idNumber.placeholder"),
        },
        birthDateLabel: t("owner.agentData.birthDateLabel"),
        phone: {
          label: t("owner.agentData.phone.label"),
          placeholder: t("owner.agentData.phone.placeholder"),
        },
        powerOfAttorney: {
          label: t("owner.agentData.powerOfAttorney.label"),
          clickHere: t("owner.agentData.powerOfAttorney.clickHere"),
          chooseFile: t("owner.agentData.powerOfAttorney.chooseFile"),
          acceptedFormats: t(
            "owner.agentData.powerOfAttorney.acceptedFormats",
          ),
          attached: t("owner.agentData.powerOfAttorney.attached"),
          preview: t("owner.agentData.powerOfAttorney.preview"),
          change: t("owner.agentData.powerOfAttorney.change"),
          delete: t("owner.agentData.powerOfAttorney.delete"),
          previewTitle: t("owner.agentData.powerOfAttorney.previewTitle"),
          closePreview: t("owner.agentData.powerOfAttorney.closePreview"),
        },
      },
      nazirData: {
        sectionTitle: t("owner.nazirData.sectionTitle"),
        sectionDescription: t("owner.nazirData.sectionDescription"),
        footerNote: t("owner.nazirData.footerNote"),
        idNumber: {
          label: t("owner.nazirData.idNumber.label"),
          placeholder: t("owner.nazirData.idNumber.placeholder"),
        },
        birthDateLabel: t("owner.nazirData.birthDateLabel"),
        phone: {
          label: t("owner.nazirData.phone.label"),
          placeholder: t("owner.nazirData.phone.placeholder"),
        },
        powerOfAttorney: {
          label: t("owner.nazirData.powerOfAttorney.label"),
          clickHere: t("owner.nazirData.powerOfAttorney.clickHere"),
          chooseFile: t("owner.nazirData.powerOfAttorney.chooseFile"),
          acceptedFormats: t(
            "owner.nazirData.powerOfAttorney.acceptedFormats",
          ),
          attached: t("owner.nazirData.powerOfAttorney.attached"),
          preview: t("owner.nazirData.powerOfAttorney.preview"),
          change: t("owner.nazirData.powerOfAttorney.change"),
          delete: t("owner.nazirData.powerOfAttorney.delete"),
          previewTitle: t("owner.nazirData.powerOfAttorney.previewTitle"),
          closePreview: t("owner.nazirData.powerOfAttorney.closePreview"),
        },
        documentHint: t("owner.nazirData.documentHint"),
      },
    },
    review: {
      navigation: {
        previous: t("review.navigation.previous"),
        continue: t("review.navigation.continue"),
        save: t("review.navigation.save"),
        saveSuccess: t("review.navigation.saveSuccess"),
        submitting: t("review.navigation.submitting"),
        submitError: t("review.navigation.submitError"),
        updateSuccess: t("review.navigation.updateSuccess"),
      },
      title: t("review.title"),
      subtitle: t("review.subtitle"),
      propertyName: {
        label: t("review.propertyName.label"),
        placeholder: t("review.propertyName.placeholder"),
        hint: t("review.propertyName.hint"),
        example: t("review.propertyName.example"),
      },
    },
    success: {
      title: t.raw("success.title") as string,
      description: t("success.description"),
      mainMenu: t("success.mainMenu"),
      mainMenuHref: t("success.mainMenuHref"),
      actions: {
        viewProperty: t("success.actions.viewProperty"),
        addUnit: t("success.actions.addUnit"),
        createContract: t("success.actions.createContract"),
      },
    },
  };

  let initialEditDraft = null;

  if (property) {
    try {
      initialEditDraft = mapPropertyApiToEditDraft(property);
    } catch {
      initialEditDraft = null;
    }
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CreatePropertyPageContent
        key={propertyId ?? "create"}
        labels={labels}
        propertyType={propertyType}
        initialEditDraft={initialEditDraft}
      />
    </HydrationBoundary>
  );
}
