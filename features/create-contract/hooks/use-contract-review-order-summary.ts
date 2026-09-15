"use client";

import { useMemo } from "react";

import { useContractPeriods } from "@/features/create-contract/hooks/use-contract-periods";
import { usePaymentTypes } from "@/features/create-contract/hooks/use-payment-types";
import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import type { ContractTypeId } from "@/features/create-contract/types/contract-type";
import { toPropertyContractType } from "@/features/create-contract/types/contract-type";
import {
  deedTypeIsDeceasedOwner,
  deedTypeIsLeaseRenewal,
  deedTypeIsSalePaper,
  type DeedTypeId,
} from "@/features/create-contract/types/deed-type";
import type { BirthDateValue } from "@/features/create-contract/types/owner-step";
import type {
  CreateContractReviewField,
  CreateContractReviewOrderSummary,
  CreateContractReviewSection,
} from "@/features/create-contract/types/create-contract-review-order";
import { isOrganizationTenantStatus } from "@/features/create-contract/types/tenant-step";
import { resolveContractAssetUrl } from "@/features/create-contract/utils/build-existing-contract-draft";
import { isOwnerStepSkipped } from "@/features/create-contract/utils/is-owner-step-skipped";
import { isSubleaseContract } from "@/features/create-contract/utils/is-sublease-contract";
import { parseContractPeriodLabel } from "@/features/create-contract/utils/parse-contract-period-label";
import {
  useUnitTypeOptions,
  useUnitUsageOptions,
} from "@/features/create-unit/hooks/use-unit-lookup-options";

type ReviewDialogLabels = CreateContractLabels["payment"]["reviewDialog"];

function withCount(template: string, count: number) {
  return template.replaceAll("{count}", String(count));
}

function displayValue(value: string | null | undefined, emptyValue: string) {
  const trimmed = value?.trim() ?? "";
  return trimmed === "" ? emptyValue : trimmed;
}

function formatBirthDate(
  value: BirthDateValue,
  calendarLabels: ReviewDialogLabels["calendar"],
  emptyValue: string,
) {
  if (!value.day || !value.month || !value.year) {
    return emptyValue;
  }

  const calendar =
    value.calendarType === "hijri"
      ? calendarLabels.hijri
      : calendarLabels.gregorian;

  return `${value.day}/${value.month}/${value.year} (${calendar})`;
}

function formatStartDate(value: BirthDateValue, emptyValue: string) {
  if (!value.day || !value.month || !value.year) {
    return emptyValue;
  }

  const day = value.day.padStart(2, "0");
  const month = value.month.padStart(2, "0");
  return `${value.year}-${month}-${day}`;
}

function indexedLabel(baseLabel: string, index: number, total: number) {
  return total > 1 ? `${baseLabel} (${index + 1})` : baseLabel;
}

function pushLocalAttachmentFields(
  fields: CreateContractReviewField[],
  files: File[],
  label: string,
  localKey: string,
) {
  files.forEach((_, index) => {
    const displayLabel = indexedLabel(label, index, files.length);
    fields.push({
      label: displayLabel,
      value: displayLabel,
      viewUrl: `local:${localKey}:${index}`,
    });
  });
}

function pushRemoteAttachmentField(
  fields: CreateContractReviewField[],
  url: string | null | undefined,
  label: string,
) {
  const resolved = resolveContractAssetUrl(url);
  if (!resolved) {
    return;
  }

  fields.push({
    label,
    value: label,
    viewUrl: resolved,
  });
}

function pushAttachmentGroup(args: {
  fields: CreateContractReviewField[];
  files: File[];
  remoteUrl?: string | null;
  label: string;
  localKey: string;
}) {
  if (args.files.length > 0) {
    pushLocalAttachmentFields(
      args.fields,
      args.files,
      args.label,
      args.localKey,
    );
    return;
  }

  pushRemoteAttachmentField(args.fields, args.remoteUrl, args.label);
}

function isUnitDataEmpty(unit: {
  unitTypeId: string;
  unitUsageId: string;
  unitNumber: string;
  floorNumber: string;
  totalArea: string;
} | undefined) {
  if (!unit) {
    return true;
  }

  return !(
    unit.unitTypeId ||
    unit.unitUsageId ||
    unit.unitNumber.trim() ||
    unit.floorNumber.trim() ||
    unit.totalArea.trim()
  );
}

function buildManualAddressValue(
  manual: {
    neighborhood: string;
    street: string;
    buildingNumber: string;
    postalCode: string;
    extraFigure: string;
  },
  emptyValue: string,
) {
  const parts = [
    manual.neighborhood,
    manual.street,
    manual.buildingNumber,
    manual.postalCode,
    manual.extraFigure,
  ]
    .map((part) => part.trim())
    .filter(Boolean);

  return parts.length > 0 ? parts.join("، ") : emptyValue;
}

export function useContractReviewOrderSummary(
  labels: ReviewDialogLabels,
  contractType: ContractTypeId,
  deedTypeLabels: Record<DeedTypeId, string>,
  deedAttachmentLabels: {
    label: string;
    salePaperLabel?: string;
    frontLabel?: string;
    backLabel?: string;
    inheritanceLabel?: string;
    heirsPoaLabel?: string;
    endowmentCertLabel?: string;
    trusteeshipLabel?: string;
    guardiansPoaLabel?: string;
    deceasedDeedLabel?: string;
  },
): CreateContractReviewOrderSummary {
  const propertyContractType = toPropertyContractType(contractType);
  const contractPeriodsQuery = useContractPeriods(propertyContractType);
  const paymentTypesQuery = usePaymentTypes(propertyContractType);
  const unitTypesQuery = useUnitTypeOptions(propertyContractType);
  const unitUsageQuery = useUnitUsageOptions(propertyContractType);

  const contractId = useCreateContractDraftStore(
    (state) => state.contractSession?.contractId ?? state.contractStep1Data?.contract_id,
  );
  const contractUuid = useCreateContractDraftStore(
    (state) => state.contractSession?.uuid ?? state.contractStep1Data?.uuid ?? "",
  );
  const selectedDeedType = useCreateContractDraftStore(
    (state) => state.deed.selectedDeedType,
  );
  const instrumentType = useCreateContractDraftStore(
    (state) => state.contractStep1Data?.instrument_type,
  );
  const instrumentTypeTrans = useCreateContractDraftStore(
    (state) => state.contractStep1Data?.instrument_type_trans,
  );
  const deedFiles = useCreateContractDraftStore((state) => state.deed.deedFiles);
  const deedFrontFiles = useCreateContractDraftStore(
    (state) => state.deed.deedFrontFiles,
  );
  const deedBackFiles = useCreateContractDraftStore(
    (state) => state.deed.deedBackFiles,
  );
  const deedInheritanceFiles = useCreateContractDraftStore(
    (state) => state.deed.deedInheritanceFiles,
  );
  const deedHeirsPoaFiles = useCreateContractDraftStore(
    (state) => state.deed.deedHeirsPoaFiles,
  );
  const deedEndowmentCertFiles = useCreateContractDraftStore(
    (state) => state.deed.deedEndowmentCertFiles,
  );
  const deedTrusteeshipFiles = useCreateContractDraftStore(
    (state) => state.deed.deedTrusteeshipFiles,
  );
  const deedGuardiansPoaFiles = useCreateContractDraftStore(
    (state) => state.deed.deedGuardiansPoaFiles,
  );
  const imageInstrument = useCreateContractDraftStore(
    (state) => state.contractStep1Data?.image_instrument,
  );
  const imageInstrumentFront = useCreateContractDraftStore(
    (state) => state.contractStep1Data?.image_instrument_from_the_front,
  );
  const imageInstrumentBack = useCreateContractDraftStore(
    (state) => state.contractStep1Data?.image_instrument_from_the_back,
  );
  const imageInheritance = useCreateContractDraftStore(
    (state) => state.contractStep1Data?.Image_inheritance_certificate,
  );
  const imageHeirsPoa = useCreateContractDraftStore(
    (state) => state.contractStep1Data?.copy_power_of_attorney_from_heirs_to_agent,
  );
  const imageEndowmentCert = useCreateContractDraftStore(
    (state) =>
      state.contractStep1Data?.copy_of_the_endowment_registration_certificate,
  );
  const imageTrusteeship = useCreateContractDraftStore(
    (state) => state.contractStep1Data?.copy_of_the_trusteeship_deed,
  );
  const imageGuardiansPoa = useCreateContractDraftStore(
    (state) =>
      state.contractStep1Data?.copy_of_guardians_power_of_attorney_for_agent,
  );
  const existingPropertyImage = useCreateContractDraftStore(
    (state) => state.existingPropertyContext?.property.image_instrument,
  );
  const leaseRenewalAddressMode = useCreateContractDraftStore(
    (state) => state.deed.leaseRenewalAddressMode,
  );
  const leaseRenewalUnitMode = useCreateContractDraftStore(
    (state) => state.tenant.leaseRenewalUnitMode,
  );
  const nationalAddressMethod = useCreateContractDraftStore(
    (state) => state.deed.nationalAddressMethod,
  );
  const nationalAddressLinkUrl = useCreateContractDraftStore(
    (state) => state.deed.nationalAddressLinkUrl,
  );
  const nationalAddressManual = useCreateContractDraftStore(
    (state) => state.deed.nationalAddressManual,
  );
  const nationalAddressPhotoFiles = useCreateContractDraftStore(
    (state) => state.deed.nationalAddressPhotoFiles,
  );
  const addressUrlFromApi = useCreateContractDraftStore(
    (state) => state.contractStep2Data?.address_url,
  );
  const addressImageFromApi = useCreateContractDraftStore(
    (state) => state.contractStep2Data?.image_address,
  );
  const ownerData = useCreateContractDraftStore((state) => state.owner.ownerData);
  const tenantData = useCreateContractDraftStore((state) => state.tenant.tenantData);
  const rentedUnits = useCreateContractDraftStore((state) => state.tenant.rentedUnits);
  const financeData = useCreateContractDraftStore((state) => state.financeData);

  return useMemo(() => {
    const empty = labels.emptyValue;
    const isSublease = isSubleaseContract({ selectedDeedType, instrumentType });
    const ownerSkipped = isOwnerStepSkipped({ selectedDeedType, instrumentType });
    const isLeaseRenewal = deedTypeIsLeaseRenewal(selectedDeedType);

    const contractTypeLabel =
      contractType === "commercial"
        ? labels.contractTypeCommercial
        : labels.contractTypeResidential;

    const durationLabel = financeData.isCustomDuration
      ? [
          financeData.customDurationYears !== "" &&
          financeData.customDurationYears > 0
            ? withCount(labels.yearsCount, financeData.customDurationYears)
            : null,
          financeData.customDurationMonths !== "" &&
          financeData.customDurationMonths > 0
            ? withCount(labels.monthsCount, financeData.customDurationMonths)
            : null,
        ]
          .filter((part): part is string => Boolean(part))
          .join(" ")
      : parseContractPeriodLabel(
          (contractPeriodsQuery.data ?? []).find(
            (period) => period.id === financeData.contractPeriodId,
          )?.period ?? "",
        ).title;

    const overview = {
      contractType: contractTypeLabel,
      startDate: formatStartDate(financeData.contractStartDate, empty),
      duration: displayValue(durationLabel, empty),
    };

    const deedTypeLabel =
      (selectedDeedType ? deedTypeLabels[selectedDeedType] : "") ||
      instrumentTypeTrans ||
      empty;

    const deedAttachmentLabel = deedTypeIsSalePaper(selectedDeedType)
      ? deedAttachmentLabels.salePaperLabel || deedAttachmentLabels.label
      : deedTypeIsDeceasedOwner(selectedDeedType)
        ? deedAttachmentLabels.deceasedDeedLabel || deedAttachmentLabels.label
        : deedAttachmentLabels.label;

    const deedFields: CreateContractReviewField[] = [
      {
        label: labels.fields.documentType,
        value: displayValue(deedTypeLabel, empty),
      },
    ];

    const mainDeedLabel = isLeaseRenewal
      ? labels.fields.leaseRenewalAttachment
      : deedAttachmentLabel;

    pushAttachmentGroup({
      fields: deedFields,
      files: deedFiles,
      remoteUrl: imageInstrument ?? existingPropertyImage,
      label: mainDeedLabel,
      localKey: "deed",
    });

    pushAttachmentGroup({
      fields: deedFields,
      files: deedFrontFiles,
      remoteUrl: imageInstrumentFront,
      label: deedAttachmentLabels.frontLabel || deedAttachmentLabels.label,
      localKey: "deed-front",
    });

    pushAttachmentGroup({
      fields: deedFields,
      files: deedBackFiles,
      remoteUrl: imageInstrumentBack,
      label: deedAttachmentLabels.backLabel || deedAttachmentLabels.label,
      localKey: "deed-back",
    });

    pushAttachmentGroup({
      fields: deedFields,
      files: deedInheritanceFiles,
      remoteUrl: imageInheritance,
      label:
        deedAttachmentLabels.inheritanceLabel || deedAttachmentLabels.label,
      localKey: "deed-inheritance",
    });

    pushAttachmentGroup({
      fields: deedFields,
      files: deedHeirsPoaFiles,
      remoteUrl: imageHeirsPoa,
      label: deedAttachmentLabels.heirsPoaLabel || deedAttachmentLabels.label,
      localKey: "deed-heirs-poa",
    });

    pushAttachmentGroup({
      fields: deedFields,
      files: deedEndowmentCertFiles,
      remoteUrl: imageEndowmentCert,
      label:
        deedAttachmentLabels.endowmentCertLabel || deedAttachmentLabels.label,
      localKey: "deed-endowment",
    });

    pushAttachmentGroup({
      fields: deedFields,
      files: deedTrusteeshipFiles,
      remoteUrl: imageTrusteeship,
      label:
        deedAttachmentLabels.trusteeshipLabel || deedAttachmentLabels.label,
      localKey: "deed-trusteeship",
    });

    pushAttachmentGroup({
      fields: deedFields,
      files: deedGuardiansPoaFiles,
      remoteUrl: imageGuardiansPoa,
      label:
        deedAttachmentLabels.guardiansPoaLabel || deedAttachmentLabels.label,
      localKey: "deed-guardians-poa",
    });

    const sections: CreateContractReviewSection[] = [
      {
        id: "deed",
        title: labels.sections.deed,
        editTarget: "deed",
        fields: deedFields,
      },
    ];

    if (!isSublease) {
      const addressFields: CreateContractReviewField[] = [];

      if (isLeaseRenewal && leaseRenewalAddressMode === "same") {
        addressFields.push({
          label: labels.fields.addressManual,
          value: labels.sameAddress,
        });
      } else if (nationalAddressMethod === "link") {
        const link =
          nationalAddressLinkUrl.trim() || addressUrlFromApi?.trim() || "";
        addressFields.push({
          label: labels.fields.mapsLink,
          value: displayValue(link, empty),
          href: link || null,
        });
      } else if (nationalAddressMethod === "manual") {
        addressFields.push({
          label: labels.fields.addressManual,
          value: buildManualAddressValue(nationalAddressManual, empty),
        });
      } else if (nationalAddressMethod === "photo") {
        if (nationalAddressPhotoFiles.length > 0) {
          pushLocalAttachmentFields(
            addressFields,
            nationalAddressPhotoFiles,
            labels.fields.addressPhoto,
            "address-photo",
          );
        } else {
          pushRemoteAttachmentField(
            addressFields,
            addressImageFromApi,
            labels.fields.addressPhoto,
          );
        }
      } else {
        const fallbackLink = addressUrlFromApi?.trim() ?? "";
        addressFields.push({
          label: labels.fields.mapsLink,
          value: displayValue(fallbackLink, empty),
          href: fallbackLink || null,
        });
      }

      sections.push({
        id: "nationalAddress",
        title: labels.sections.nationalAddress,
        editTarget: "nationalAddress",
        fields: addressFields,
      });
    }

    if (!ownerSkipped) {
      sections.push({
        id: "owner",
        title:
          ownerData.hasAgent === "yes"
            ? labels.sections.ownerWithAgent
            : labels.sections.ownerSelf,
        editTarget: "owner",
        fields: [
          {
            label: labels.fields.ownerId,
            value: displayValue(ownerData.idNumber, empty),
          },
          {
            label: labels.fields.ownerPhone,
            value: displayValue(ownerData.phone, empty),
          },
          {
            label: labels.fields.ownerBirthDate,
            value: formatBirthDate(
              ownerData.birthDate,
              labels.calendar,
              empty,
            ),
          },
        ],
      });
    }

    {
      const isOrganization = isOrganizationTenantStatus(tenantData.status);
      const tenantFields: CreateContractReviewField[] = isOrganization
        ? [
            {
              label: labels.fields.tenantDelegation,
              value: displayValue(
                tenantData.organization.delegationType
                  ? labels.delegation[tenantData.organization.delegationType]
                  : "",
                empty,
              ),
            },
            {
              label: labels.fields.tenantUnifiedRecord,
              value: displayValue(
                tenantData.organization.unifiedRecordNumber,
                empty,
              ),
            },
            {
              label: labels.fields.tenantOwnerId,
              value: displayValue(
                tenantData.organization.ownerIdNumber,
                empty,
              ),
            },
            {
              label: labels.fields.tenantOwnerPhone,
              value: displayValue(tenantData.organization.ownerPhone, empty),
            },
            {
              label: labels.fields.tenantOwnerBirthDate,
              value: formatBirthDate(
                tenantData.organization.ownerBirthDate,
                labels.calendar,
                empty,
              ),
            },
          ]
        : [
            {
              label: labels.fields.tenantId,
              value: displayValue(tenantData.individual.idNumber, empty),
            },
            {
              label: labels.fields.tenantPhone,
              value: displayValue(tenantData.individual.phone, empty),
            },
            {
              label: labels.fields.tenantBirthDate,
              value: formatBirthDate(
                tenantData.individual.birthDate,
                labels.calendar,
                empty,
              ),
            },
          ];

      sections.push({
        id: "tenant",
        title: isOrganization
          ? labels.sections.tenantOrganization
          : labels.sections.tenantIndividual,
        editTarget: "tenant",
        fields: tenantFields,
      });
    }

    const isSameUnit = isLeaseRenewal && leaseRenewalUnitMode === "same";

    if (isSameUnit) {
      sections.push({
        id: "unit",
        title: labels.sections.unit,
        editTarget: "unit",
        fields: [
          {
            label: labels.fields.unitType,
            value: labels.sameUnit,
          },
        ],
      });
    } else {
      const unitsToShow =
        rentedUnits.length > 0 ? rentedUnits : [undefined];

      unitsToShow.forEach((unit, unitIndex) => {
        const unitTypeName =
          (unitTypesQuery.data ?? []).find(
            (option) => String(option.id) === unit?.unitTypeId,
          )?.name ?? "";
        const unitUsageName =
          (unitUsageQuery.data ?? []).find(
            (option) => String(option.id) === unit?.unitUsageId,
          )?.name ?? "";

        const unitIncomplete = isUnitDataEmpty(unit);
        const unitTitle =
          rentedUnits.length > 1
            ? `${labels.sections.unit} (${unitIndex + 1})`
            : labels.sections.unit;

        const unitFields: CreateContractReviewField[] = unitIncomplete
          ? []
          : [
              {
                label: labels.fields.unitType,
                value: displayValue(unitTypeName, empty),
              },
              {
                label: labels.fields.unitUsage,
                value: displayValue(unitUsageName, empty),
              },
              {
                label: labels.fields.floor,
                value: displayValue(unit?.floorNumber, empty),
              },
              {
                label: labels.fields.unitNumber,
                value: displayValue(unit?.unitNumber, empty),
              },
              {
                label: labels.fields.area,
                value: unit?.totalArea?.trim()
                  ? `${unit.totalArea} ${labels.areaUnit}`
                  : empty,
              },
              {
                label: labels.fields.rooms,
                value: displayValue(unit?.roomsCount, empty),
              },
              {
                label: labels.fields.bathrooms,
                value: displayValue(unit?.bathroomsCount, empty),
              },
              {
                label: labels.fields.kitchens,
                value: displayValue(unit?.kitchensCount, empty),
              },
              {
                label: labels.fields.kitchenCabinets,
                value: unit?.kitchenCabinetsInstalled
                  ? labels.kitchenCabinets.installed
                  : labels.kitchenCabinets.notInstalled,
              },
            ];

        sections.push({
          id: `unit-${unitIndex}`,
          title: unitTitle,
          editTarget: "unit",
          fields: unitFields,
          incomplete: unitIncomplete,
        });
      });
    }

    const paymentTypeName =
      (paymentTypesQuery.data ?? []).find(
        (option) => option.id === financeData.paymentTypeId,
      )?.name ?? "";

    const rentAmount = displayValue(financeData.totalRentAmount, empty);
    const rentAmountDisplay =
      rentAmount === empty
        ? empty
        : `${rentAmount} ${labels.currency}`;

    sections.push({
      id: "rent",
      title: labels.sections.rent,
      editTarget: "rent",
      variant: "rent",
      fields: [
        {
          label: labels.fields.paymentMethod,
          value: labels.paymentMethodPrefix.replace(
            "{method}",
            displayValue(paymentTypeName, empty),
          ),
        },
        {
          label: labels.sections.rent,
          value: rentAmountDisplay,
        },
      ],
    });

    const orderNumber =
      contractId != null && String(contractId).trim() !== ""
        ? String(contractId)
        : empty;

    const contractUuidValue =
      contractUuid != null && contractUuid.trim() !== "" ? contractUuid : empty;

    const copyLines = [
      `${labels.orderNumber}: ${orderNumber}`,
      `${labels.contractUuid}: ${contractUuidValue}`,
      `${labels.fields.contractType}: ${overview.contractType}`,
      `${labels.fields.startDate}: ${overview.startDate}`,
      `${labels.fields.duration}: ${overview.duration}`,
      ...sections.flatMap((section) => [
        section.title,
        ...section.fields.map((field) => `${field.label}: ${field.value}`),
      ]),
    ];

    return {
      orderNumber,
      contractUuid: contractUuidValue,
      overview,
      sections,
      copyText: copyLines.join("\n"),
    };
  }, [
    addressImageFromApi,
    addressUrlFromApi,
    contractId,
    contractUuid,
    contractPeriodsQuery.data,
    contractType,
    deedAttachmentLabels,
    deedBackFiles,
    deedEndowmentCertFiles,
    deedFiles,
    deedFrontFiles,
    deedGuardiansPoaFiles,
    deedHeirsPoaFiles,
    deedInheritanceFiles,
    deedTrusteeshipFiles,
    deedTypeLabels,
    existingPropertyImage,
    financeData,
    imageEndowmentCert,
    imageGuardiansPoa,
    imageHeirsPoa,
    imageInheritance,
    imageInstrument,
    imageInstrumentBack,
    imageInstrumentFront,
    imageTrusteeship,
    instrumentType,
    instrumentTypeTrans,
    labels,
    leaseRenewalAddressMode,
    leaseRenewalUnitMode,
    nationalAddressLinkUrl,
    nationalAddressManual,
    nationalAddressMethod,
    nationalAddressPhotoFiles,
    ownerData,
    paymentTypesQuery.data,
    rentedUnits,
    selectedDeedType,
    tenantData,
    unitTypesQuery.data,
    unitUsageQuery.data,
  ]);
}
