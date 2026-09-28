import type { CreateContractStep } from "@/features/create-contract/types/create-contract-step";
import type { DeedTypeId } from "@/features/create-contract/types/deed-type";
import {
  EMPTY_AGENT_DATA,
  EMPTY_OWNER_DATA,
  type AgentDataState,
  type CalendarType,
  type HasAgentOption,
  type OwnerDataState,
} from "@/features/create-contract/types/owner-step";
import {
  EMPTY_RENTED_UNIT_DATA,
  type RentedUnitDataState,
} from "@/features/create-contract/types/rented-unit-step";
import {
  createEmptyTenantData,
  type TenantDataState,
  type TenantStatusOption,
} from "@/features/create-contract/types/tenant-step";
import type {
  UncompletedContractData,
  UncompletedContractStep3,
  UncompletedContractStep4,
  UncompletedContractUnit,
} from "@/features/create-contract/types/uncompleted-contract";
import {
  formatContractPhoneForForm,
  parseContractBirthDate,
  parseContractBirthDateParts,
  toOptionalCount,
  toStringValue,
} from "@/features/create-contract/utils/build-existing-contract-draft";
import { isOwnerStepSkipped } from "@/features/create-contract/utils/is-owner-step-skipped";
import { mapAuthorizationTypeToTenantDelegation } from "@/features/create-contract/utils/map-tenant-delegation-to-authorization-type";
import { requiresDeceasedOwnerLegalAgent } from "@/features/create-contract/utils/requires-deceased-owner-legal-agent";
import { requiresWaqfOwnerNazir } from "@/features/create-contract/utils/requires-waqf-owner-nazir";
import { toFloorFormValue } from "@/features/shared/utils/format-floor-display";
import { formatUnifiedRecordNumberForForm } from "@/lib/validation/format-unified-record-number-for-form";

// Backend `step` is the next step to complete (1-based across the API steps):
// step1 = deed instrument, step2 = national address (+ nazir / deceased legal agent),
// step3 = owner (or legal-agent-only for deceased-owner), step4 = tenant,
// step7 = payment.
export function mapBackendStepToWizardStep(
  step: number,
  options?: {
    selectedDeedType?: DeedTypeId | "";
    instrumentType?: string | null;
  },
): CreateContractStep {
  const skipState = {
    selectedDeedType: options?.selectedDeedType,
    instrumentType: options?.instrumentType,
  };
  const waqfNazir = requiresWaqfOwnerNazir(skipState);
  const ownerSkipped = isOwnerStepSkipped(skipState);
  const deceasedLegalAgent = requiresDeceasedOwnerLegalAgent(skipState);

  // Address is still collected on the deed screen; nazir / legal agent follow.
  if (step <= 2) {
    if (step === 2 && deceasedLegalAgent) {
      return "owner";
    }
    return "deed";
  }

  if (step === 3) {
    // Endowment skips owner — after step2 (nazir identity) resume at tenant.
    if (waqfNazir || ownerSkipped) {
      return "tenant";
    }
    return "owner";
  }

  if (step === 4 || step === 5) {
    return "tenant";
  }

  if (step === 6) {
    return "finance";
  }

  if (step >= 7) {
    return "payment";
  }

  return "deed";
}

function hasAgentFromValue(value: number | boolean | null): HasAgentOption {
  return value === 1 || value === true ? "yes" : "no";
}

export function buildOwnerDataFromStep3(
  step3: UncompletedContractStep3,
): OwnerDataState {
  const calendarType: CalendarType = step3.type_dob_property_owner ?? "hijri";

  return {
    ...EMPTY_OWNER_DATA,
    idNumber: step3.property_owner_id_num?.replace(/\D/g, "") ?? "",
    birthDate: parseContractBirthDate(step3.property_owner_dob, calendarType),
    phone: formatContractPhoneForForm(step3.property_owner_mobile),
    iban: step3.property_owner_iban ?? "",
    hasAgent: hasAgentFromValue(step3.add_legal_agent_of_owner),
  };
}

type LegalAgentPrefillSource = {
  id_num_of_property_owner_agent?: string | null;
  mobile_of_property_owner_agent?: string | null;
  type_dob_property_owner_agent?: CalendarType | null;
  dob_of_property_owner_agent?: string | null;
  dob_of_property_owner_agent_day?: string | null;
  dob_of_property_owner_agent_month?: string | null;
  dob_of_property_owner_agent_year?: string | null;
};

export function buildAgentDataFromLegalAgentSource(
  source: LegalAgentPrefillSource | null | undefined,
): AgentDataState {
  if (!source) {
    return { ...EMPTY_AGENT_DATA };
  }

  const calendarType: CalendarType =
    source.type_dob_property_owner_agent ?? "hijri";

  const combinedDob =
    source.dob_of_property_owner_agent ??
    (source.dob_of_property_owner_agent_day &&
    source.dob_of_property_owner_agent_month &&
    source.dob_of_property_owner_agent_year
      ? `${String(source.dob_of_property_owner_agent_day).padStart(2, "0")}-${String(source.dob_of_property_owner_agent_month).padStart(2, "0")}-${source.dob_of_property_owner_agent_year}`
      : null);

  return {
    ...EMPTY_AGENT_DATA,
    idNumber: source.id_num_of_property_owner_agent?.replace(/\D/g, "") ?? "",
    phone: formatContractPhoneForForm(
      source.mobile_of_property_owner_agent ?? null,
    ),
    birthDate: parseContractBirthDate(combinedDob, calendarType),
    powerOfAttorneyFiles: [],
  };
}

export function buildAgentDataFromStep3(
  step3: UncompletedContractStep3,
): AgentDataState {
  const calendarType: CalendarType =
    step3.type_dob_property_owner_agent ?? "hijri";

  return {
    ...EMPTY_AGENT_DATA,
    idNumber: step3.id_num_of_property_owner_agent?.replace(/\D/g, "") ?? "",
    birthDate: parseContractBirthDate(
      step3.dob_of_property_owner_agent,
      calendarType,
    ),
    phone: formatContractPhoneForForm(step3.mobile_of_property_owner_agent),
    powerOfAttorneyFiles: [],
  };
}

function toCalendarType(value: string | null | undefined): CalendarType {
  return value === "gregorian" ? "gregorian" : "hijri";
}

function mapTenantEntityToStatus(
  tenantEntity: string | null | undefined,
): TenantStatusOption {
  const normalized = tenantEntity?.trim().toLowerCase() ?? "";

  if (
    normalized === "institution" ||
    normalized === "company" ||
    normalized === "establishment" ||
    normalized === "establishment-or-company"
  ) {
    return "establishment-or-company";
  }

  return "individual";
}

function hasTenantStep4Values(step4: UncompletedContractStep4) {
  return Boolean(
    step4.tenant_entity ||
      step4.tenant_id_num ||
      step4.tenant_mobile ||
      step4.tenant_dob ||
      step4.tenant_dob_day ||
      step4.tenant_entity_unified_registry_number ||
      step4.id_num_of_property_tenant_agent,
  );
}

export function buildTenantDataFromStep4(
  step4: UncompletedContractStep4 | null | undefined,
): TenantDataState {
  const empty = createEmptyTenantData();

  if (!step4 || !hasTenantStep4Values(step4)) {
    return empty;
  }

  const status = mapTenantEntityToStatus(step4.tenant_entity);
  const tenantCalendarType = toCalendarType(step4.type_tenant_dob);
  const agentCalendarType = toCalendarType(step4.type_dob_tenant_agent);
  const delegationType =
    mapAuthorizationTypeToTenantDelegation(step4.authorization_type) ||
    empty.organization.delegationType;

  return {
    status,
    individual: {
      ...empty.individual,
      idNumber: step4.tenant_id_num?.replace(/\D/g, "") ?? "",
      phone: formatContractPhoneForForm(step4.tenant_mobile ?? null),
      birthDate: parseContractBirthDateParts({
        day: step4.tenant_dob_day,
        month: step4.tenant_dob_month,
        year: step4.tenant_dob_year,
        combined: step4.tenant_dob,
        calendarType: tenantCalendarType,
      }),
    },
    organization: {
      ...empty.organization,
      delegationType,
      unifiedRecordNumber: formatUnifiedRecordNumberForForm(
        step4.tenant_entity_unified_registry_number,
      ),
      ownerIdNumber:
        step4.id_num_of_property_tenant_agent?.replace(/\D/g, "") ?? "",
      ownerPhone: formatContractPhoneForForm(
        step4.mobile_of_property_tenant_agent ?? null,
      ),
      ownerBirthDate: parseContractBirthDateParts({
        day: step4.dobof_property_tenant_agent_day,
        month: step4.dobof_property_tenant_agent_month,
        year: step4.dobof_property_tenant_agent_year,
        combined: step4.dob_of_property_tenant_agent,
        calendarType: agentCalendarType,
      }),
      powerOfAttorneyFiles: [],
    },
  };
}

function resolveUncompletedUnits(
  data: UncompletedContractData,
): UncompletedContractUnit[] {
  if (Array.isArray(data.units) && data.units.length > 0) {
    return data.units;
  }

  if (Array.isArray(data.step5?.units) && data.step5.units.length > 0) {
    return data.step5.units;
  }

  if (
    data.step5 &&
    (data.step5.unit_type_id ||
      data.step5.unit_number ||
      data.step5.unit_area ||
      data.step5.floor_number)
  ) {
    return [data.step5];
  }

  return [];
}

function toMeterRegistration(
  value: string | null | undefined,
): RentedUnitDataState["electricityMeterRegistration"] {
  return value === "owner" || value === "tenant" ? value : "";
}

function isTruthyFlag(value: boolean | number | string | null | undefined) {
  return value === true || value === 1 || value === "1";
}

export function buildRentedUnitFromUncompleted(
  unit: UncompletedContractUnit,
): RentedUnitDataState {
  const hasElectricityMeter =
    isTruthyFlag(unit.electricity_meter) || Boolean(unit.electricity_meter_number);
  const hasWaterMeter =
    isTruthyFlag(unit.water_meter) || Boolean(unit.water_meter_number);
  const furnished = isTruthyFlag(unit.furnished);

  return {
    ...EMPTY_RENTED_UNIT_DATA,
    unitId: unit.unit_id ?? unit.id ?? undefined,
    contractType:
      unit.contract_type === "commercial" || unit.contract_type === "housing"
        ? unit.contract_type
        : undefined,
    unitTypeId: toStringValue(unit.unit_type_id),
    unitUsageId: toStringValue(unit.unit_usage_id),
    totalArea: toStringValue(unit.unit_area),
    floorNumber: toFloorFormValue(unit.floor_number),
    unitNumber: toStringValue(unit.unit_number),
    roomsCount: toOptionalCount(unit.number_of_rooms ?? unit.tootal_rooms),
    hallsCount: toOptionalCount(unit.The_number_of_halls),
    kitchensCount: toOptionalCount(unit.The_number_of_kitchens),
    bathroomsCount: toOptionalCount(
      unit.The_number_of_toilets ?? unit.The_number_of_the_toilet,
    ),
    windowAcCount: toOptionalCount(unit.window_ac),
    splitAcCount: toOptionalCount(unit.split_ac),
    kitchenCabinetsInstalled: isTruthyFlag(unit.kitchen_tank),
    furnished,
    furnishingType: furnished ? (isTruthyFlag(unit.type_furnished) ? "new" : "used") : "",
    addElectricityMeter: hasElectricityMeter,
    electricityMeterNumber: toStringValue(unit.electricity_meter_number),
    electricityMeterRegistration: toMeterRegistration(
      unit.electricity_meter_ownership,
    ),
    addWaterMeter: hasWaterMeter,
    waterMeterNumber: toStringValue(unit.water_meter_number),
    waterMeterRegistration: toMeterRegistration(unit.water_meter_ownership),
  };
}

export function buildRentedUnitsFromUncompleted(
  data: UncompletedContractData,
): RentedUnitDataState[] {
  const units = resolveUncompletedUnits(data);

  if (units.length === 0) {
    return [{ ...EMPTY_RENTED_UNIT_DATA }];
  }

  return units.map((unit) => buildRentedUnitFromUncompleted(unit));
}

export function resolveTenantPhaseIndex(step: number) {
  return step >= 5 ? 1 : 0;
}

export function resolveUncompletedContractUuid(
  data: UncompletedContractData,
  requestUuid?: string,
) {
  const candidates = [
    requestUuid,
    data.uuid,
    data.step1?.uuid,
    data.step2?.uuid,
    data.step3?.uuid,
    data.step4?.uuid,
    data.step5?.uuid,
    data.step6?.uuid,
  ];

  for (const value of candidates) {
    if (typeof value === "string" && value.trim() !== "") {
      return value.trim();
    }
  }

  return "";
}
