"use server";

import type {
  SettingContractItem,
  SettingContractsApiResponse,
} from "@/features/shared/types/setting-contract";
import { apiRequest } from "@/lib/api/api-request";

export async function getSettingContracts(): Promise<SettingContractItem[]> {
  const response = await apiRequest<SettingContractsApiResponse>(
    "/setting-contracts",
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok || !response.data?.success) {
    throw new Error(
      response.error ||
        response.data?.message ||
        "Failed to fetch setting contracts",
    );
  }

  return response.data.data;
}
