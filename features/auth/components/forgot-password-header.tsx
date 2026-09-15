import CustomIcon from "@/features/shared/components/custom-icon";

type ForgotPasswordHeaderProps = {
  title: string;
  subtitle: string;
};

export default function ForgotPasswordHeader({
  title,
  subtitle,
}: ForgotPasswordHeaderProps) {
  return (
    <header className="flex flex-col items-center space-y-3 text-center">
      <CustomIcon
        src="/icons/forget-password.svg"
        size={36}
        className="text-brand"
      />

      <h1 className="text-xl font-bold text-brand md:text-2xl">{title}</h1>

      <p className="text-sm text-gray-600 md:text-base">{subtitle}</p>
    </header>
  );
}
