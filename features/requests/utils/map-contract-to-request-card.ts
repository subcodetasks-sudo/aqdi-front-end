import type {
  RequestActionType,
  RequestCardData,
  RequestStatus,
} from "@/features/requests/types/request";
import type { ContractListItem } from "@/features/requests/types/contract-list-item";
import { normalizeContractStatusSnapshot } from "@/features/requests/utils/normalize-contract-status";

type ContractCardLabels = {
  housing: string;
  commercial: string;
};

function formatContractDate(isoDate: string) {
  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

function formatLastUpdated(isoDate: string) {
  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const period = hours >= 12 ? "م" : "ص";
  hours = hours % 12 || 12;
  const hoursLabel = String(hours).padStart(2, "0");

  return `${year}/${month}/${day} · ${hoursLabel}:${minutes} ${period}`;
}

function resolveStatus(contract: ContractListItem): RequestStatus {
  if (contract.is_completed) {
    return "completed";
  }

  if (contract.is_draft || contract.step < 3) {
    return "incomplete";
  }

  const statusText =
    contract.status_label || contract.contract_status_name || "";

  if (statusText.includes("مرتجع")) {
    return "returned";
  }

  return "in-progress";
}

function resolveActionType(
  contract: ContractListItem,
  status: RequestStatus,
): RequestActionType {
  if (!contract.is_completed && contract.step !== 7) {
    return "none";
  }

  if (contract.step === 7) {
    return contract.is_completed ? "dual-actions" : "complete-payment";
  }

  if (status === "completed" || status === "returned") {
    return "help-center";
  }

  return "dual-actions";
}

export function mapContractToRequestCard(
  contract: ContractListItem,
  labels: ContractCardLabels,
): RequestCardData {
  const status = resolveStatus(contract);
  const contractType =
    contract.contract_type === "commercial" ? "commercial" : "residential";
  const requestNumber = String(contract.id);
  const snapshot = normalizeContractStatusSnapshot(
    contract as unknown as Record<string, unknown>,
    contract.id,
  );

  const actionType = resolveActionType(contract, status);
  const isIncompleteDraft = !contract.is_completed && contract.step !== 7;

  return {
    id: String(contract.id),
    contractId: contract.id,
    contractType,
    uuid: contract.uuid,
    title:
      contract.name_real_estate?.trim() ||
      (contractType === "commercial" ? labels.commercial : labels.housing),
    date: formatContractDate(contract.created_at),
    lastUpdated: formatLastUpdated(contract.created_at),
    requestNumber,
    step: contract.step,
    status,
    statusName: snapshot.status_label || null,
    statusColor: snapshot.status_color || null,
    statusType: snapshot.status_type,
    statusCode: snapshot.status || null,
    journeyStatus: snapshot.journey_status || null,
    journeyStatusLabel: snapshot.journey_status_label || null,
    paymentSuccessful: contract.is_completed,
    paymentStatusLabel:
      snapshot.journey_status_label || snapshot.status_label || null,
    isIncompleteDraft,
    showViewEdit: contract.step !== 7,
    showDownloadInvoice: !isIncompleteDraft,
    actionType,
    searchText: [
      requestNumber,
      contract.uuid,
      contract.name_real_estate,
      contract.property_owner_id_num,
      contract.tenant_id_num,
      snapshot.status_label,
      snapshot.journey_status_label,
      contract.contract_status_name,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase(),
  };
}
