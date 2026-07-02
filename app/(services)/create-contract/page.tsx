import { getTranslations } from "next-intl/server";

import CreateContractPageContent from "@/features/create-contract/components/create-contract-page-content";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import type { ContractTypeId } from "@/features/create-contract/types/contract-type";
import { DEED_TYPES } from "@/features/create-contract/types/deed-type";
import { PAYMENT_METHOD_OPTIONS } from "@/features/create-contract/types/finance-step";
import {
  DELEGATION_TYPE_OPTIONS,
  TENANT_STATUS_OPTIONS,
} from "@/features/create-contract/types/tenant-step";

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
      startContractLoading: t("intro.startContractLoading"),
      startContractError: t("intro.startContractError"),
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
        submitting: t("deed.navigation.submitting"),
      },
      submitError: t("deed.submitError"),
      submitAddressError: t("deed.submitAddressError"),
      missingContractSession: t("deed.missingContractSession"),
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
      nationalAddress: {
        methods: t.raw("deed.nationalAddress.methods") as string[],
        mapTitle: t("deed.nationalAddress.mapTitle"),
        mapHint: t("deed.nationalAddress.mapHint"),
        coordinatesLabel: t("deed.nationalAddress.coordinatesLabel"),
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
    owner: {
      navigation: {
        previous: t("owner.navigation.previous"),
        continue: t("owner.navigation.continue"),
        submitting: t("owner.navigation.submitting"),
      },
      submitError: t("owner.submitError"),
      missingContractSession: t("owner.missingContractSession"),
      validation: {
        hintTitle: t("owner.validation.hintTitle"),
        issues: t.raw("owner.validation.issues") as CreateContractLabels["owner"]["validation"]["issues"],
        fieldErrors: {
          idNumberLength: t("owner.validation.fieldErrors.idNumberLength"),
          phoneLength: t("owner.validation.fieldErrors.phoneLength"),
          iban: t("owner.validation.fieldErrors.iban"),
        },
      },
      phases: t.raw("owner.phases") as CreateContractLabels["owner"]["phases"],
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
          options: t.raw(
            "owner.ownerData.hasAgent.options",
          ) as CreateContractLabels["owner"]["ownerData"]["hasAgent"]["options"],
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
          acceptedFormats: t("owner.agentData.powerOfAttorney.acceptedFormats"),
          preview: t("owner.agentData.powerOfAttorney.preview"),
          delete: t("owner.agentData.powerOfAttorney.delete"),
          previewTitle: t("owner.agentData.powerOfAttorney.previewTitle"),
          closePreview: t("owner.agentData.powerOfAttorney.closePreview"),
        },
      },
    },
    tenant: {
      cancelRequest: t("tenant.cancelRequest"),
      submitError: t("tenant.submitError"),
      submitUnitError: t("tenant.submitUnitError"),
      missingContractSession: t("tenant.missingContractSession"),
      saveLaterError: t("tenant.saveLaterError"),
      navigation: {
        previous: t("tenant.navigation.previous"),
        continue: t("tenant.navigation.continue"),
        saveLater: t("tenant.navigation.saveLater"),
        savingLater: t("tenant.navigation.savingLater"),
        submitting: t("tenant.navigation.submitting"),
      },
      phases: t.raw("tenant.phases") as CreateContractLabels["tenant"]["phases"],
      tenantStatus: {
        label: t("tenant.tenantStatus.label"),
        placeholder: t("tenant.tenantStatus.placeholder"),
        options: Object.fromEntries(
          TENANT_STATUS_OPTIONS.map((status) => [
            status,
            t(`tenant.tenantStatus.options.${status}`),
          ]),
        ) as CreateContractLabels["tenant"]["tenantStatus"]["options"],
      },
      birthDate: {
        label: t("tenant.birthDate.label"),
        hijri: t("tenant.birthDate.hijri"),
        gregorian: t("tenant.birthDate.gregorian"),
        day: t("tenant.birthDate.day"),
        month: t("tenant.birthDate.month"),
        year: t("tenant.birthDate.year"),
        dayPlaceholder: t("tenant.birthDate.dayPlaceholder"),
        monthPlaceholder: t("tenant.birthDate.monthPlaceholder"),
        yearPlaceholder: t("tenant.birthDate.yearPlaceholder"),
      },
      individualData: {
        idNumber: {
          label: t("tenant.individualData.idNumber.label"),
          placeholder: t("tenant.individualData.idNumber.placeholder"),
        },
        phone: {
          label: t("tenant.individualData.phone.label"),
          placeholder: t("tenant.individualData.phone.placeholder"),
        },
      },
      organizationData: {
        delegationType: {
          label: t("tenant.organizationData.delegationType.label"),
          placeholder: t("tenant.organizationData.delegationType.placeholder"),
          options: Object.fromEntries(
            DELEGATION_TYPE_OPTIONS.map((delegationType) => [
              delegationType,
              t(
                `tenant.organizationData.delegationType.options.${delegationType}`,
              ),
            ]),
          ) as CreateContractLabels["tenant"]["organizationData"]["delegationType"]["options"],
        },
        region: {
          label: t("tenant.organizationData.region.label"),
          placeholder: t("tenant.organizationData.region.placeholder"),
          loading: t("tenant.organizationData.region.loading"),
        },
        city: {
          label: t("tenant.organizationData.city.label"),
          placeholder: t("tenant.organizationData.city.placeholder"),
          loading: t("tenant.organizationData.city.loading"),
          selectRegionFirst: t("tenant.organizationData.city.selectRegionFirst"),
        },
        unifiedRecordNumber: {
          label: t("tenant.organizationData.unifiedRecordNumber.label"),
          placeholder: t(
            "tenant.organizationData.unifiedRecordNumber.placeholder",
          ),
        },
        ownerIdNumber: {
          label: t("tenant.organizationData.ownerIdNumber.label"),
          placeholder: t("tenant.organizationData.ownerIdNumber.placeholder"),
        },
        ownerBirthDateLabel: t(
          "tenant.organizationData.ownerBirthDateLabel",
        ),
        ownerPhone: {
          label: t("tenant.organizationData.ownerPhone.label"),
          placeholder: t("tenant.organizationData.ownerPhone.placeholder"),
        },
        powerOfAttorney: {
          label: t("tenant.organizationData.powerOfAttorney.label"),
          clickHere: t("tenant.organizationData.powerOfAttorney.clickHere"),
          chooseFile: t("tenant.organizationData.powerOfAttorney.chooseFile"),
          acceptedFormats: t(
            "tenant.organizationData.powerOfAttorney.acceptedFormats",
          ),
          preview: t("tenant.organizationData.powerOfAttorney.preview"),
          delete: t("tenant.organizationData.powerOfAttorney.delete"),
          previewTitle: t(
            "tenant.organizationData.powerOfAttorney.previewTitle",
          ),
          closePreview: t(
            "tenant.organizationData.powerOfAttorney.closePreview",
          ),
        },
      },
      rentedUnit: {
        selectPlaceholder: t("tenant.rentedUnit.selectPlaceholder"),
        optionsError: t("tenant.rentedUnit.optionsError"),
        unitType: {
          label: t("tenant.rentedUnit.unitType.label"),
        },
        unitUsage: {
          label: t("tenant.rentedUnit.unitUsage.label"),
        },
        totalArea: {
          label: t("tenant.rentedUnit.totalArea.label"),
          placeholder: t("tenant.rentedUnit.totalArea.placeholder"),
          suffix: t("tenant.rentedUnit.totalArea.suffix"),
        },
        floorNumber: {
          label: t("tenant.rentedUnit.floorNumber.label"),
        },
        floorOptions: {
          ground: t("tenant.rentedUnit.floorOptions.ground"),
        },
        unitNumber: {
          label: t("tenant.rentedUnit.unitNumber.label"),
          placeholder: t("tenant.rentedUnit.unitNumber.placeholder"),
        },
        roomsCount: {
          label: t("tenant.rentedUnit.roomsCount.label"),
        },
        hallsCount: {
          label: t("tenant.rentedUnit.hallsCount.label"),
        },
        majlisCount: {
          label: t("tenant.rentedUnit.majlisCount.label"),
        },
        kitchensCount: {
          label: t("tenant.rentedUnit.kitchensCount.label"),
        },
        bathroomsCount: {
          label: t("tenant.rentedUnit.bathroomsCount.label"),
        },
        windowAcCount: {
          label: t("tenant.rentedUnit.windowAcCount.label"),
        },
        splitAcCount: {
          label: t("tenant.rentedUnit.splitAcCount.label"),
        },
        kitchenCabinetsInstalled: {
          label: t("tenant.rentedUnit.kitchenCabinetsInstalled.label"),
        },
        furnished: {
          label: t("tenant.rentedUnit.furnished.label"),
        },
        furnishingType: {
          label: t("tenant.rentedUnit.furnishingType.label"),
          new: t("tenant.rentedUnit.furnishingType.new"),
          used: t("tenant.rentedUnit.furnishingType.used"),
        },
        addElectricityMeter: {
          label: t("tenant.rentedUnit.addElectricityMeter.label"),
        },
        electricityMeterNumber: {
          label: t("tenant.rentedUnit.electricityMeterNumber.label"),
          placeholder: t("tenant.rentedUnit.electricityMeterNumber.placeholder"),
        },
        addWaterMeter: {
          label: t("tenant.rentedUnit.addWaterMeter.label"),
        },
        waterMeterNumber: {
          label: t("tenant.rentedUnit.waterMeterNumber.label"),
          placeholder: t("tenant.rentedUnit.waterMeterNumber.placeholder"),
        },
      },
      saveLaterDialog: {
        title: t("tenant.saveLaterDialog.title"),
        close: t("tenant.saveLaterDialog.close"),
        successTitle: t("tenant.saveLaterDialog.successTitle"),
        successDescription: t("tenant.saveLaterDialog.successDescription"),
        orderNumberLabel: t("tenant.saveLaterDialog.orderNumberLabel"),
        copy: t("tenant.saveLaterDialog.copy"),
        copied: t("tenant.saveLaterDialog.copied"),
        copySuccess: t("tenant.saveLaterDialog.copySuccess"),
        copyError: t("tenant.saveLaterDialog.copyError"),
        retentionNotice: t("tenant.saveLaterDialog.retentionNotice"),
        retentionDays: t("tenant.saveLaterDialog.retentionDays"),
        orders: t("tenant.saveLaterDialog.orders"),
        ordersHref: t("tenant.saveLaterDialog.ordersHref"),
        mainMenu: t("tenant.saveLaterDialog.mainMenu"),
        mainMenuHref: t("tenant.saveLaterDialog.mainMenuHref"),
      },
    },
    finance: {
      title: t("finance.title"),
      subtitle: t("finance.subtitle"),
      submitError: t("finance.submitError"),
      missingContractSession: t("finance.missingContractSession"),
      navigation: {
        previous: t("finance.navigation.previous"),
        continue: t("finance.navigation.continue"),
        submitting: t("finance.navigation.submitting"),
      },
      selectPlaceholder: t("finance.selectPlaceholder"),
      contractStartDate: {
        label: t("finance.contractStartDate.label"),
        hijri: t("finance.contractStartDate.hijri"),
        gregorian: t("finance.contractStartDate.gregorian"),
        day: t("finance.contractStartDate.day"),
        month: t("finance.contractStartDate.month"),
        year: t("finance.contractStartDate.year"),
        dayPlaceholder: t("finance.contractStartDate.dayPlaceholder"),
        monthPlaceholder: t("finance.contractStartDate.monthPlaceholder"),
        yearPlaceholder: t("finance.contractStartDate.yearPlaceholder"),
      },
      contractDuration: {
        label: t("finance.contractDuration.label"),
        loading: t("finance.contractDuration.loading"),
        optionsError: t("finance.contractDuration.optionsError"),
      },
      totalRentAmount: {
        label: t("finance.totalRentAmount.label"),
        placeholder: t("finance.totalRentAmount.placeholder"),
      },
      paymentMethod: {
        label: t("finance.paymentMethod.label"),
        options: Object.fromEntries(
          PAYMENT_METHOD_OPTIONS.map((paymentMethod) => [
            paymentMethod,
            t(`finance.paymentMethod.options.${paymentMethod}`),
          ]),
        ) as CreateContractLabels["finance"]["paymentMethod"]["options"],
      },
      addTenantPermissions: {
        label: t("finance.addTenantPermissions.label"),
        edit: t("finance.addTenantPermissions.edit"),
      },
      addOtherConditions: {
        label: t("finance.addOtherConditions.label"),
        add: t("finance.addOtherConditions.add"),
      },
      tenantPermissionsDialog: {
        title: t("finance.tenantPermissionsDialog.title"),
        close: t("finance.tenantPermissionsDialog.close"),
        heading: t("finance.tenantPermissionsDialog.heading"),
        subtitle: t("finance.tenantPermissionsDialog.subtitle"),
        continue: t("finance.tenantPermissionsDialog.continue"),
        optionsError: t("finance.tenantPermissionsDialog.optionsError"),
      },
      otherConditionsDialog: {
        title: t("finance.otherConditionsDialog.title"),
        close: t("finance.otherConditionsDialog.close"),
        heading: t("finance.otherConditionsDialog.heading"),
        subtitle: t("finance.otherConditionsDialog.subtitle"),
        termsLabel: t("finance.otherConditionsDialog.termsLabel"),
        termsPlaceholder: t("finance.otherConditionsDialog.termsPlaceholder"),
        save: t("finance.otherConditionsDialog.save"),
      },
    },
    payment: {
      title: t("payment.title"),
      subtitle: t("payment.subtitle"),
      navigation: {
        previous: t("payment.navigation.previous"),
        pay: t("payment.navigation.pay"),
      },
      summary: {
        ejarFees: t("payment.summary.ejarFees"),
        contractPeriodPrice: t("payment.summary.contractPeriodPrice"),
        vat: t("payment.summary.vat"),
        applicationFees: t("payment.summary.applicationFees"),
        total: t("payment.summary.total"),
        currency: t("payment.summary.currency"),
        ejarLogoAlt: t("payment.summary.ejarLogoAlt"),
      },
      savePropertyData: {
        label: t("payment.savePropertyData.label"),
      },
      disclaimer: {
        prefix: t("payment.disclaimer.prefix"),
        termsLink: t("payment.disclaimer.termsLink"),
        and: t("payment.disclaimer.and"),
        privacyLink: t("payment.disclaimer.privacyLink"),
        termsHref: t("payment.disclaimer.termsHref"),
        privacyHref: t("payment.disclaimer.privacyHref"),
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
