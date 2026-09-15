"use client";

import { useQuery } from "@tanstack/react-query";

import { contractLocationKeys } from "@/features/create-contract/query-keys";
import { getTenantRoles } from "@/features/create-contract/services/get-tenant-roles";

export function useTenantRoles() {
  return useQuery({
    queryKey: [...contractLocationKeys.all, "tenant-roles"] as const,
    queryFn: () => getTenantRoles(),
  });
}
