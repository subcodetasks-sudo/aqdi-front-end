import CustomIcon from "@/features/shared/components/custom-icon";

type VerifyOtpHeaderProps = {
  title: string;
  instruction: string;
  phone: string;
};

export default function VerifyOtpHeader({
  title,
  instruction,
  phone,
}: VerifyOtpHeaderProps) {
  return (
    <header className="flex flex-col items-center space-y-3 text-center">
     
        <CustomIcon
          src="/icons/app.svg"
          size={36}
          className="text-brand text-center"
        />

      <h1 className="text-xl font-bold text-brand ">{title}</h1>

      <p className="text-sm text-gray-600 md:text-base">{instruction}</p>

      <p className="text-base font-semibold text-foreground" dir="ltr">
        {phone}
      </p>
    </header>
  );
}
