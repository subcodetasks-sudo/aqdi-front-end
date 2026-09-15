import Link from "next/link";

import AuthOrDivider from "@/features/auth/components/auth-or-divider";

type LoginFooterProps = {
  orLabel: string;
  noAccount: string;
  createAccount: string;
};

export default function LoginFooter({
  orLabel,
  noAccount,
  createAccount,
}: LoginFooterProps) {
  return (
    <div className="space-y-4 ">
      <AuthOrDivider label={orLabel} />

      <p className="text-center text-sm leading-relaxed">
        <span className="text-[#888888]">{noAccount} </span>
        <Link
          href="/register"
          className="font-bold text-brand transition-colors hover:text-brand/80"
        >
          {createAccount}
        </Link>
      </p>
    </div>
  );
}
