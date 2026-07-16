"use server";

import type {
  InstrumentTypePopupApiResponse,
  InstrumentTypePopupContext,
  InstrumentTypePopupItem,
} from "@/features/shared/types/instrument-type-popup";
import { apiRequest } from "@/lib/api/api-request";

export async function getInstrumentTypePopup(
  instrumentType: string,
  context: InstrumentTypePopupContext,
): Promise<InstrumentTypePopupItem[]> {
  const response = await apiRequest<InstrumentTypePopupApiResponse>(
    `/popup-contracts?instrument_type=${encodeURIComponent(instrumentType)}&context=${context}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok || !response.data?.success) {
    throw new Error(
      response.error ||
        response.data?.message ||
        "Failed to fetch instrument type popup",
    );
  }

  return response.data.data;
}
