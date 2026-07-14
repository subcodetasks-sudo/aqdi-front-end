"use client";

import { useQuery } from "@tanstack/react-query";

import { settingContractsKeys } from "@/features/shared/query-keys";
import { getSettingContracts } from "@/features/shared/services/get-setting-contracts";

export function useSettingContracts() {
  return useQuery({
    queryKey: settingContractsKeys.list(),
    queryFn: () => getSettingContracts(),
  });
}
