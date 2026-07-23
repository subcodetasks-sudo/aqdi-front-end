"use server";

import type { TenantRolesApiResponse } from "@/features/create-contract/types/tenant-role";
import { normalizeTenantRole } from "@/features/create-contract/utils/tenant-role-helpers";
import { apiRequest } from "@/lib/api/api-request";

export async function getTenantRoles() {
  const response = await apiRequest<TenantRolesApiResponse>("/tenant-roles", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok || !response.data?.success) {
    throw new Error(
      response.error || response.data?.message || "Failed to fetch tenant roles",
    );
  }

  return (response.data.data ?? []).map((role) => normalizeTenantRole(role));
}
