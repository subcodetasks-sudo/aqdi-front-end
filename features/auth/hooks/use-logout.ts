"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { logoutUser } from "@/features/auth/services/logout-user";
import { useAuthStore } from "@/features/auth/stores/use-auth-store";

export function useLogout() {
  const router = useRouter();
  const clearUser = useAuthStore((state) => state.clearUser);
  const [isLoading, setIsLoading] = useState(false);

  async function logout() {
    setIsLoading(true);

    try {
      const response = await logoutUser();

      if (!response.ok) {
        return {
          ok: false as const,
          error: response.error,
        };
      }

      clearUser();
      router.push("/login");

      return {
        ok: true as const,
        message: response.message,
      };
    } finally {
      setIsLoading(false);
    }
  }

  return {
    logout,
    isLoading,
  };
}
