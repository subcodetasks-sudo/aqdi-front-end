import AuthBackButton from "@/features/auth/components/auth-back-button";

type PropertiesHeaderProps = {
  backLabel: string;
  pageTitle: string;
};

export default function PropertiesHeader({
  backLabel,
  pageTitle,
}: PropertiesHeaderProps) {
  return (
    <div className="mb-8 flex justify-strat ">
      <AuthBackButton label={backLabel} title={pageTitle} href="/" />
    </div>
  );
}
