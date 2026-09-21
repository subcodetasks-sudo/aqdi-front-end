import type { AuthTokenPayload } from "@/features/auth/types/auth-user";

export type RefreshTokenApiResponse = {
  message: string;
  code: number;
  success: boolean;
  data?: AuthTokenPayload;
};
