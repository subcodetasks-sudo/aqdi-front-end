"use client";

import { useMemo } from "react";

import { useContractPeriods } from "@/features/create-contract/hooks/use-contract-periods";
import { usePaymentTypes } from "@/features/create-contract/hooks/use-payment-types";
import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import type { ContractTypeId } from "@/features/create-contract/types/contract-type";
import { toPropertyContractType } from "@/features/create-contract/types/contract-type";
import {
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

function resolveDeedImageUrl(args: {
  deedFiles: File[];
  deedFrontFiles: File[];
  imageInstrument: string | null | undefined;
  imageInstrumentFront: string | null | undefined;
  existingPropertyImage: string | null | undefined;
}) {
  if (args.deedFiles[0] || args.deedFrontFiles[0]) {
    return "local:deed";
  }

  return (
    resolveContractAssetUrl(args.imageInstrument) ??
    resolveContractAssetUrl(args.imageInstrumentFront) ??
    resolveContractAssetUrl(args.existingPropertyImage)
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
  const imageInstrument = useCreateContractDraftStore(
    (state) => state.contractStep1Data?.image_instrument,
  );
  const imageInstrumentFront = useCreateContractDraftStore(
    (state) => state.contractStep1Data?.image_instrument_from_the_front,
  );
  const existingPropertyImage = useCreateContractDraftStore(
    (state) => state.existingPropertyContext?.property.image_instrument,
  );
  const leaseRenewalAddressMode = useCreateContractDraftStore(
    (state) => state.deed.leaseRenewalAddressMode,
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
      : deedAttachmentLabels.label;

    const deedImageUrl = resolveDeedImageUrl({
      deedFiles,
      deedFrontFiles,
      imageInstrument,
      imageInstrumentFront,
      existingPropertyImage,
    });

    const deedFields: CreateContractReviewField[] = [
      {
        label: labels.fields.documentType,
        value: displayValue(deedTypeLabel, empty),
      },
    ];

    if (!isLeaseRenewal) {
      deedFields.push({
        label: deedAttachmentLabel,
        value: deedImageUrl ? deedAttachmentLabel : empty,
        viewUrl: deedImageUrl,
      });
    }

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
        const photoUrl =
          nationalAddressPhotoFiles[0]
            ? "local:address-photo"
            : resolveContractAssetUrl(addressImageFromApi);
        addressFields.push({
          label: labels.fields.addressPhoto,
          value: photoUrl ? labels.fields.addressPhoto : empty,
          viewUrl: photoUrl,
        });
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
      const tenantId = isOrganization
        ? tenantData.organization.ownerIdNumber
        : tenantData.individual.idNumber;
      const tenantPhone = isOrganization
        ? tenantData.organization.ownerPhone
        : tenantData.individual.phone;
      const tenantBirthDate = isOrganization
        ? tenantData.organization.ownerBirthDate
        : tenantData.individual.birthDate;

      sections.push({
        id: "tenant",
        title: isOrganization
          ? labels.sections.tenantOrganization
          : labels.sections.tenantIndividual,
        editTarget: "tenant",
        fields: [
          {
            label: labels.fields.tenantId,
            value: displayValue(tenantId, empty),
          },
          {
            label: labels.fields.tenantPhone,
            value: displayValue(tenantPhone, empty),
          },
          {
            label: labels.fields.tenantBirthDate,
            value: formatBirthDate(tenantBirthDate, labels.calendar, empty),
          },
        ],
      });
    }

    const unit = rentedUnits[0];
    const unitTypeName =
      (unitTypesQuery.data ?? []).find(
        (option) => String(option.id) === unit?.unitTypeId,
      )?.name ?? "";
    const unitUsageName =
      (unitUsageQuery.data ?? []).find(
        (option) => String(option.id) === unit?.unitUsageId,
      )?.name ?? "";

    sections.push({
      id: "unit",
      title: labels.sections.unit,
      editTarget: "unit",
      fields: [
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
      ],
    });

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

    const copyLines = [
      `${labels.orderNumber}: ${orderNumber}`,
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
      overview,
      sections,
      copyText: copyLines.join("\n"),
    };
  }, [
    addressImageFromApi,
    addressUrlFromApi,
    contractId,
    contractPeriodsQuery.data,
    contractType,
    deedAttachmentLabels.label,
    deedAttachmentLabels.salePaperLabel,
    deedFiles,
    deedFrontFiles,
    deedTypeLabels,
    existingPropertyImage,
    financeData,
    imageInstrument,
    imageInstrumentFront,
    instrumentType,
    instrumentTypeTrans,
    labels,
    leaseRenewalAddressMode,
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
