import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";

import CreatePropertyPageContent from "@/features/create-property/components/create-property-page-content";
import type { CreatePropertyLabels } from "@/features/create-property/types/create-property-labels";
import { PROPERTY_DEED_TYPES } from "@/features/create-property/types/deed-type";
import { PROPERTY_HAS_AGENT_OPTIONS } from "@/features/create-property/types/owner-step";
import { mapPropertyApiToEditDraft } from "@/features/create-property/utils/map-property-api-to-draft";
import { parsePropertyId } from "@/features/create-property/utils/parse-property-id";
import { parsePropertyType } from "@/features/properties/types/property-type";
import { getPropertyUnits } from "@/features/property-units/services/get-property-units";
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
  const propertyId = parsePropertyId(propertyIdParam);
  const t = await getTranslations("createProperty");
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: settingContractsKeys.list(),
    queryFn: () => getSettingContracts(),
  });

  const labels: CreatePropertyLabels = {
    backLabel: t("backLabel"),
    pageTitle: t("pageTitle"),
    pageTitleResidential: t("pageTitleResidential"),
    pageTitleCommercial: t("pageTitleCommercial"),
    editPageTitleResidential: t("editPageTitleResidential"),
    editPageTitleCommercial: t("editPageTitleCommercial"),
    stepper: {
      steps: {
        deed: t("stepper.steps.deed"),
        address: t("stepper.steps.address"),
        owner: t("stepper.steps.owner"),
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
        clickHere: t("deed.deedImage.clickHere"),
        chooseFile: t("deed.deedImage.chooseFile"),
        acceptedFormats: t("deed.deedImage.acceptedFormats"),
        preview: t("deed.deedImage.preview"),
        delete: t("deed.deedImage.delete"),
        previewTitle: t("deed.deedImage.previewTitle"),
        closePreview: t("deed.deedImage.closePreview"),
      },
      waqf: {
        multipleTrusteesLabel: t("deed.waqf.multipleTrusteesLabel"),
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
          "map" | "photo" | "link" | "manual",
          string
        >,
        mapTitle: t("address.nationalAddress.mapTitle"),
        mapHint: t("address.nationalAddress.mapHint"),
        coordinatesLabel: t("address.nationalAddress.coordinatesLabel"),
        link: {
          label: t("address.nationalAddress.link.label"),
          placeholder: t("address.nationalAddress.link.placeholder"),
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
          preview: t("address.nationalAddress.photo.preview"),
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
        fullName: {
          label: t("owner.ownerData.fullName.label"),
          placeholder: t("owner.ownerData.fullName.placeholder"),
        },
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
          label: t("owner.ownerData.hasAgent.label"),
          placeholder: t("owner.ownerData.hasAgent.placeholder"),
          options: Object.fromEntries(
            PROPERTY_HAS_AGENT_OPTIONS.map((option) => [
              option,
              t(`owner.ownerData.hasAgent.options.${option}`),
            ]),
          ) as CreatePropertyLabels["owner"]["ownerData"]["hasAgent"]["options"],
        },
      },
      agentData: {
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
          preview: t("owner.agentData.powerOfAttorney.preview"),
          delete: t("owner.agentData.powerOfAttorney.delete"),
          previewTitle: t("owner.agentData.powerOfAttorney.previewTitle"),
          closePreview: t("owner.agentData.powerOfAttorney.closePreview"),
        },
      },
    },
    review: {
      navigation: {
        previous: t("review.navigation.previous"),
        continue: t("review.navigation.continue"),
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

  let initialEditDraft = null;

  if (propertyId) {
    try {
      const property = await getPropertyUnits(propertyId);
      initialEditDraft = mapPropertyApiToEditDraft(property);
    } catch {
      initialEditDraft = null;
    }
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CreatePropertyPageContent
        labels={labels}
        propertyType={propertyType}
        initialEditDraft={initialEditDraft}
      />
    </HydrationBoundary>
  );
}
