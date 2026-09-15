"use server";

import type { TenantRolesApiResponse } from "@/features/create-contract/types/tenant-role";
import { normalizeTenantRole } from "@/features/create-contract/utils/tenant-role-helpers";
import { apiRequest } from "@/lib/api/api-request";
import { sanitizeRichText } from "@/lib/security/sanitize-rich-text";

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

  return (response.data.data ?? []).map((raw) => {
    const role = normalizeTenantRole(raw);

    return {
      ...role,
      service_definition: role.service_definition
        ? sanitizeRichText(role.service_definition)
        : null,
    };
  });
}
