"use client";

import { useQuery } from "@tanstack/react-query";

import { meterFeeSettingsKeys } from "@/features/shared/query-keys";
import { getMeterFeeSettings } from "@/features/shared/services/get-meter-fee-settings";

export function useMeterFeeSettings() {
  return useQuery({
    queryKey: meterFeeSettingsKeys.detail(),
    queryFn: () => getMeterFeeSettings(),
  });
}
