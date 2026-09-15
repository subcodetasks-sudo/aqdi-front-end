"use client";

import { useQuery } from "@tanstack/react-query";

import { contractLocationKeys } from "@/features/create-contract/query-keys";
import { getCities } from "@/features/create-contract/services/get-cities";
import { getRegions } from "@/features/create-contract/services/get-regions";

export function useRegionOptions() {
  return useQuery({
    queryKey: contractLocationKeys.regions(),
    queryFn: () => getRegions(),
  });
}

export function useCityOptions(regionId: number | "") {
  return useQuery({
    queryKey: contractLocationKeys.cities(regionId || 0),
    queryFn: () => getCities(regionId as number),
    enabled: typeof regionId === "number" && regionId > 0,
  });
}
