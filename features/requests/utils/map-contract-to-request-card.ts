import type {
  RequestActionType,
  RequestCardData,
  RequestStatus,
} from "@/features/requests/types/request";
import type { ContractListItem } from "@/features/requests/types/contract-list-item";

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

function resolveStatus(contract: ContractListItem): RequestStatus {
  if (contract.is_completed) {
    return "completed";
  }

  if (contract.is_draft || contract.step < 3) {
    return "incomplete";
  }

  if (contract.contract_status_name?.includes("مرتجع")) {
    return "returned";
  }

  return "in-progress";
}

function resolveActionType(status: RequestStatus): RequestActionType {
  if (status === "completed" || status === "returned") {
    return "help-center";
  }

  if (status === "incomplete") {
    return "complete-payment";
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

  return {
    id: String(contract.id),
    contractId: contract.id,
    contractType,
    title:
      contract.name_real_estate?.trim() ||
      (contractType === "commercial" ? labels.commercial : labels.housing),
    date: formatContractDate(contract.created_at),
    requestNumber: `#${contract.uuid}`,
    status,
    paymentSuccessful: contract.is_completed,
    showViewEdit: !contract.is_completed,
    actionType: resolveActionType(status),
  };
}
