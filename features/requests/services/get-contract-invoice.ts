"use server";

import type { ContractFinancialApiResponse } from "@/features/create-contract/types/contract-financial";
import type {
  ContractInvoice,
  ContractInvoiceApiResponse,
} from "@/features/requests/types/contract-invoice";
import {
  buildInvoiceFromContractAndFinancial,
  type InvoiceChromeLabels,
} from "@/features/requests/utils/build-invoice-from-contract-financial";
import { normalizeContractInvoice } from "@/features/requests/utils/normalize-contract-invoice";
import { apiRequest } from "@/lib/api/api-request";

export type GetContractInvoiceResult =
  | { ok: true; data: ContractInvoice }
  | { ok: false; error: string };

type GetContractInvoiceOptions = {
  contractId: number;
  uuid: string;
  contractTypeLabel: string;
  chrome: InvoiceChromeLabels;
  locale?: string;
};

function extractInvoicePayload(
  response: Awaited<ReturnType<typeof apiRequest<ContractInvoiceApiResponse>>>,
): Record<string, unknown> | null {
  if (!response.ok || !response.data) {
    return null;
  }

  const root = response.data as ContractInvoiceApiResponse &
    Record<string, unknown>;

  if (root.data && typeof root.data === "object" && !Array.isArray(root.data)) {
    const data = root.data as Record<string, unknown>;
    if (typeof data.invoice_number === "string" || Array.isArray(data.items)) {
      return data;
    }
  }

  if (typeof root.invoice_number === "string" || Array.isArray(root.items)) {
    return root as Record<string, unknown>;
  }

  return null;
}

async function fetchDedicatedInvoice(
  contractId: number,
): Promise<ContractInvoice | null> {
  const dedicatedPaths = [
    `/invoices/${contractId}`,
    `/contracts/${contractId}/invoice`,
  ];

  for (const path of dedicatedPaths) {
    const response = await apiRequest<ContractInvoiceApiResponse>(path, {
      method: "GET",
      cache: "no-store",
    });

    // Skip missing routes / 4xx without surfacing them to the UI.
    if (!response.ok) {
      continue;
    }

    const payload = extractInvoicePayload(response);
    if (!payload) {
      continue;
    }

    return normalizeContractInvoice(payload, contractId);
  }

  return null;
}

async function fetchComposedInvoice({
  contractId,
  uuid,
  contractTypeLabel,
  chrome,
  locale = "ar",
}: GetContractInvoiceOptions): Promise<GetContractInvoiceResult> {
  const [contractResponse, financialResponse] = await Promise.all([
    apiRequest<{
      success?: boolean;
      message?: string;
      data?: Record<string, unknown>;
    }>(`/contracts/${contractId}`, {
      method: "GET",
      cache: "no-store",
    }),
    apiRequest<ContractFinancialApiResponse>(`/financial/${uuid}`, {
      method: "GET",
      cache: "no-store",
    }),
  ]);

  if (!contractResponse.ok || !contractResponse.data?.data) {
    return {
      ok: false,
      error:
        contractResponse.error ||
        contractResponse.data?.message ||
        "Failed to fetch contract details",
    };
  }

  if (
    !financialResponse.ok ||
    financialResponse.data?.status !== "success" ||
    !financialResponse.data.data
  ) {
    return {
      ok: false,
      error:
        financialResponse.error ||
        financialResponse.data?.message ||
        "Failed to fetch financial details",
    };
  }

  return {
    ok: true,
    data: buildInvoiceFromContractAndFinancial({
      contractId,
      contract: contractResponse.data.data,
      financial: financialResponse.data.data,
      contractTypeLabel,
      chrome,
      locale,
    }),
  };
}

export async function getContractInvoice(
  options: GetContractInvoiceOptions,
): Promise<GetContractInvoiceResult> {
  // Compose from contract + financial first — dedicated invoice routes are
  // not published on the backend yet and previously 404'd into the UI.
  const composed = await fetchComposedInvoice(options);
  if (composed.ok) {
    return composed;
  }

  try {
    const dedicated = await fetchDedicatedInvoice(options.contractId);
    if (dedicated) {
      return { ok: true, data: dedicated };
    }
  } catch {
    // Ignore dedicated-route failures.
  }

  return composed;
}
