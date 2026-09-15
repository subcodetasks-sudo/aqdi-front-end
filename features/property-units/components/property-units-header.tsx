import AuthBackButton from "@/features/auth/components/auth-back-button";

type PropertyUnitsHeaderProps = {
  backLabel: string;
  pageTitle: string;
};

export default function PropertyUnitsHeader({
  backLabel,
  pageTitle,
}: PropertyUnitsHeaderProps) {
  return (
    <div className="mb-6 flex justify-start md:mb-8">
      <AuthBackButton
        label={backLabel}
        title={pageTitle}
        href="/properties/my-properties"
      />
    </div>
  );
}
