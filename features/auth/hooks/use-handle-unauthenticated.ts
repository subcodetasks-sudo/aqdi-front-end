"use client";

import { usePathname, useRouter } from "next/navigation";

import { useAuthStore } from "@/features/auth/stores/use-auth-store";

export function useHandleUnauthenticated() {
  const router = useRouter();
  const pathname = usePathname();
  const clearUser = useAuthStore((state) => state.clearUser);

  return function handleUnauthenticated() {
    clearUser();
    router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
  };
}
