import Link from "next/link";

import AuthOrDivider from "@/features/auth/components/auth-or-divider";

type ForgotPasswordFooterProps = {
  orLabel: string;
  rememberedPassword: string;
  backToLogin: string;
};

export default function ForgotPasswordFooter({
  orLabel,
  rememberedPassword,
  backToLogin,
}: ForgotPasswordFooterProps) {
  return (
    <div className="space-y-4">
      <AuthOrDivider label={orLabel} />

      <p className="text-center text-sm leading-relaxed">
        <span className="text-[#888888]">{rememberedPassword} </span>
        <Link
          href="/login"
          className="font-bold text-brand transition-colors hover:text-brand/80"
        >
          {backToLogin}
        </Link>
      </p>
    </div>
  );
}
