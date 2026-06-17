export function buildResetPasswordUrl(phone?: string) {
  if (!phone) {
    return "/reset-password";
  }

  const params = new URLSearchParams({ phone });
  return `/reset-password?${params.toString()}`;
}
