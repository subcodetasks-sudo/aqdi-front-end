"use server";

import type {
  MeterFeeSettings,
  MeterFeeSettingsApiResponse,
} from "@/features/shared/types/meter-fee-settings";
import { apiRequest } from "@/lib/api/api-request";

export async function getMeterFeeSettings(): Promise<MeterFeeSettings> {
  const response = await apiRequest<MeterFeeSettingsApiResponse>(
    "/meter-fee-settings",
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok || !response.data?.success) {
    throw new Error(
      response.error ||
        response.data?.message ||
        "Failed to fetch meter fee settings",
    );
  }

  return response.data.data;
}
