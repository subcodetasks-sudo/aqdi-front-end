type CreatePropertyStepPhaseHeaderProps = {
  title: string;
  subtitle: string;
};

export default function CreatePropertyStepPhaseHeader({
  title,
  subtitle,
}: CreatePropertyStepPhaseHeaderProps) {
  return (
    <div className="mb-8 flex flex-col items-center gap-2 text-center">
      <h2 className="text-2xl font-extrabold text-brand md:text-3xl">
        {title}
      </h2>
      <p className="text-sm text-[#7f7f7f]">{subtitle}</p>
    </div>
  );
}
