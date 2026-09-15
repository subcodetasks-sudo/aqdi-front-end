import { getSaudiMobileForApi } from "@/features/auth/utils/normalize-saudi-phone";

export function buildResetPasswordUrl(phone?: string, code?: string) {
  if (!phone) {
    return "/reset-password";
  }

  const params = new URLSearchParams({
    phone: getSaudiMobileForApi(phone),
  });

  if (code) {
    params.set("code", code);
  }

  return `/reset-password?${params.toString()}`;
}
