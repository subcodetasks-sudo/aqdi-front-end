import { getSaudiMobileForApi } from "@/features/auth/utils/normalize-saudi-phone";

type VerifyOtpFlow = "register" | "forgot-password";

export function buildVerifyOtpUrl(phone: string, flow: VerifyOtpFlow) {
  const params = new URLSearchParams({
    phone: getSaudiMobileForApi(phone),
    flow,
  });

  return `/verify-otp?${params.toString()}`;
}

export function getVerifyOtpBackHref(flow?: string) {
  if (flow === "forgot-password") {
    return "/forgot-password";
  }

  return "/register";
}
