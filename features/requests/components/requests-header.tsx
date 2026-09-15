import AuthBackButton from "@/features/auth/components/auth-back-button";

type RequestsHeaderProps = {
  backLabel: string;
  pageTitle: string;
};

export default function RequestsHeader({
  backLabel,
  pageTitle,
}: RequestsHeaderProps) {
  return (
    <div className="mb-6 flex justify-start md:mb-8">
      <AuthBackButton label={backLabel} title={pageTitle} href="/" />
    </div>
  );
}
