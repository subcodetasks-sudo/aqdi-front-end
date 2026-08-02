type CreateContractStepPhaseHeaderProps = {
  title: string;
  subtitle: string;
};

export default function CreateContractStepPhaseHeader({
  title,
  subtitle,
}: CreateContractStepPhaseHeaderProps) {
  return (
    <div className="mb-3 flex flex-col items-center gap-1 text-center">
      <h2 className="text-xl font-extrabold text-brand md:text-2xl">
        {title}
      </h2>
      <p className="text-sm text-[#7f7f7f]">{subtitle}</p>
    </div>
  );
}
