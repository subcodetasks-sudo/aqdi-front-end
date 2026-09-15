import Link from "next/link";

import AuthOrDivider from "@/features/auth/components/auth-or-divider";

type RegisterFooterProps = {
  orLabel: string;
  hasAccount: string;
  signIn: string;
};

export default function RegisterFooter({
  orLabel,
  hasAccount,
  signIn,
}: RegisterFooterProps) {
  return (
    <div className="space-y-4">
      <AuthOrDivider label={orLabel} />

      <p className="text-center text-sm leading-relaxed">
        <span className="text-[#888888]">{hasAccount} </span>
        <Link
          href="/login"
          className="font-bold text-brand transition-colors hover:text-brand/80"
        >
          {signIn}
        </Link>
      </p>
    </div>
  );
}
