"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/features/auth/stores/use-auth-store";
import { myPropertiesKeys } from "@/features/my-properties/query-keys";
import { getMyProperties } from "@/features/my-properties/services/get-my-properties";

export const PROPERTIES_LANDING_HREF = "/properties";
export const MY_PROPERTIES_HREF = "/properties/my-properties";

export function usePropertiesNavHref() {
  const user = useAuthStore((state) => state.user);

  const { data: properties } = useQuery({
    queryKey: myPropertiesKeys.nav(),
    queryFn: async () => {
      try {
        return await getMyProperties();
      } catch {
        return [];
      }
    },
    enabled: Boolean(user),
    staleTime: 60_000,
  });

  if (!user) {
    return PROPERTIES_LANDING_HREF;
  }

  if (properties && properties.length > 0) {
    return MY_PROPERTIES_HREF;
  }

  return PROPERTIES_LANDING_HREF;
}

export function isPropertiesNavActive(pathname: string) {
  return pathname === "/properties" || pathname.startsWith("/properties/");
}
