import { getSaudiMobileForApi } from "@/features/auth/utils/normalize-saudi-phone";

export type VerifyOtpFlow = "register" | "forgot-password" | "login";

type BuildVerifyOtpUrlOptions = {
  rememberMe?: boolean;
  callbackUrl?: string | null;
};

export function buildVerifyOtpUrl(
  phone: string,
  flow: VerifyOtpFlow,
  options?: BuildVerifyOtpUrlOptions,
) {
  const params = new URLSearchParams({
    phone: getSaudiMobileForApi(phone),
    flow,
  });

  if (flow === "login") {
    if (options?.rememberMe) {
      params.set("rememberMe", "1");
    }

    if (options?.callbackUrl) {
      params.set("callbackUrl", options.callbackUrl);
    }
  }

  return `/verify-otp?${params.toString()}`;
}

export function getVerifyOtpBackHref(flow?: string) {
  if (flow === "forgot-password") {
    return "/forgot-password";
  }

  if (flow === "login") {
    return "/login";
  }

  return "/register";
}
