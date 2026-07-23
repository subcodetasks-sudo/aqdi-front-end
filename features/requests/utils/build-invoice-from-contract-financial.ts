import type { ContractFinancialData } from "@/features/create-contract/types/contract-financial";
import {
  getContractFinancialServiceLabel,
  getContractFinancialServicePrice,
} from "@/features/create-contract/utils/contract-financial-display";
import type { ContractInvoice } from "@/features/requests/types/contract-invoice";

export type InvoiceChromeLabels = {
  title: string;
  platformName: string;
  platformSubtitle: string;
  printLabel: string;
  totalDueLabel: string;
  unpaidStatusLabel: string;
  paidStatusLabel: string;
};

function formatAmountLabel(amount: number) {
  return amount.toLocaleString("en-US");
}

export function buildInvoiceFromContractAndFinancial({
  contractId,
  contract,
  financial,
  contractTypeLabel,
  chrome,
  locale = "ar",
}: {
  contractId: number;
  contract: Record<string, unknown>;
  financial: ContractFinancialData;
  contractTypeLabel: string;
  chrome: InvoiceChromeLabels;
  locale?: string;
}): ContractInvoice {
  const isCompleted = Boolean(contract.is_completed);
  const statusLabel =
    (typeof contract.status_label === "string" && contract.status_label.trim()) ||
    (typeof contract.contract_status_name === "string" &&
      contract.contract_status_name.trim()) ||
    (isCompleted ? chrome.paidStatusLabel : chrome.unpaidStatusLabel);

  const statusColor =
    (typeof contract.status_color === "string" && contract.status_color.trim()) ||
    (typeof contract.contract_status_color === "string" &&
      contract.contract_status_color.trim()) ||
    (isCompleted ? "#2f9e6f" : "#e67e22");

  const items = (financial.services ?? [])
    .map((service, index) => {
      const amount = getContractFinancialServicePrice(service);
      if (amount <= 0) {
        return null;
      }

      return {
        index: index + 1,
        description: getContractFinancialServiceLabel(service, locale),
        amount_label: formatAmountLabel(amount),
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .map((item, index) => ({ ...item, index: index + 1 }));

  const total =
    typeof financial.total_price === "number" && Number.isFinite(financial.total_price)
      ? financial.total_price
      : items.reduce((sum, item) => {
          const numeric = Number(String(item.amount_label).replace(/,/g, ""));
          return sum + (Number.isFinite(numeric) ? numeric : 0);
        }, 0);

  const createdAt =
    typeof contract.created_at === "string" ? contract.created_at : null;
  const uuid =
    typeof contract.uuid === "string" ? contract.uuid : String(contractId);

  return {
    contractId,
    platform_name: chrome.platformName,
    platform_subtitle: chrome.platformSubtitle,
    title: chrome.title,
    invoice_number: `INV-${contractId}`,
    datetime_label: createdAt ?? "",
    reference_number: uuid,
    customer_name:
      (typeof contract.property_owner_id_num === "string" &&
        contract.property_owner_id_num.trim()) ||
      null,
    order_number: `#${contractId}`,
    contract_type_label: contractTypeLabel,
    items,
    total_due_label: chrome.totalDueLabel,
    total_amount_label: formatAmountLabel(total),
    status: isCompleted ? "paid" : "unpaid",
    status_label: statusLabel,
    status_color: statusColor,
    print_label: chrome.printLabel,
    is_paid: isCompleted,
    is_refunded: false,
    total_amount: total,
  };
}
