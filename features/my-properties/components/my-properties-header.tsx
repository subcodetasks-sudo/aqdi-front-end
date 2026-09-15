import AuthBackButton from "@/features/auth/components/auth-back-button";

type MyPropertiesHeaderProps = {
  backLabel: string;
  pageTitle: string;
};

export default function MyPropertiesHeader({
  backLabel,
  pageTitle,
}: MyPropertiesHeaderProps) {
  return (
    <div className="mb-6 flex justify-start md:mb-8">
      <AuthBackButton label={backLabel} title={pageTitle} href="/" />
    </div>
  );
}
