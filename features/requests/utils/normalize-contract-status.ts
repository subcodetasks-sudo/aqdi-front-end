import type {
  ContractDetail,
  ContractJourneyStep,
  ContractJourneyStepState,
  ContractStatusSnapshot,
  ContractStatusType,
} from "@/features/requests/types/contract-journey";

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function asNullableString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function asNullableNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() && !Number.isNaN(Number(value))) {
    return Number(value);
  }

  return null;
}

function normalizeJourneyState(value: unknown): ContractJourneyStepState {
  if (value === "completed" || value === "current" || value === "pending") {
    return value;
  }

  return "pending";
}

function normalizeStatusType(value: unknown): ContractStatusType {
  return value === "draft" ? "draft" : "contract";
}

export function normalizeJourneySteps(raw: unknown): ContractJourneyStep[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw.map((item, index) => {
    const row = (item && typeof item === "object" ? item : {}) as Record<
      string,
      unknown
    >;
    const key = asString(row.key) || asString(row.status) || `step-${index + 1}`;

    return {
      key,
      status: asString(row.status) || key,
      status_label: asString(row.status_label) || key,
      description: asString(row.description),
      state: normalizeJourneyState(row.state),
    };
  });
}

export function normalizeContractStatusSnapshot(
  raw: Record<string, unknown>,
  fallbackContractId?: number,
): ContractStatusSnapshot {
  const contractId =
    asNullableNumber(raw.id) ??
    asNullableNumber(raw.contract_id) ??
    fallbackContractId ??
    0;

  const statusLabel =
    asNullableString(raw.status_label) ||
    asNullableString(raw.contract_status_name) ||
    asString(raw.status);

  const statusColor =
    asNullableString(raw.status_color) ||
    asNullableString(raw.contract_status_color);

  const statusId =
    asNullableNumber(raw.status_id) ??
    asNullableNumber(raw.contract_status_id);

  return {
    contractId,
    status: asString(raw.status) || asString(raw.journey_status),
    status_label: statusLabel,
    status_type: normalizeStatusType(raw.status_type),
    status_id: statusId,
    status_color: statusColor,
    status_description: asNullableString(raw.status_description),
    journey_status: asString(raw.journey_status),
    journey_status_label:
      asNullableString(raw.journey_status_label) || statusLabel,
    journey: normalizeJourneySteps(raw.journey),
  };
}

export function normalizeContractDetail(
  raw: Record<string, unknown>,
): ContractDetail {
  const snapshot = normalizeContractStatusSnapshot(raw);

  return {
    ...snapshot,
    uuid: asNullableString(raw.uuid) ?? undefined,
    is_completed: Boolean(raw.is_completed),
    is_draft: Boolean(raw.is_draft),
    step: asNullableNumber(raw.step) ?? undefined,
  };
}
