import { Building2 } from "lucide-react";

type CreateUnitStepPhaseHeaderProps = {
  title: string;
  subtitle: string;
};

export default function CreateUnitStepPhaseHeader({
  title,
  subtitle,
}: CreateUnitStepPhaseHeaderProps) {
  return (
    <div className="mb-8 flex flex-col items-center gap-3 text-center">
      <span className="inline-flex text-brand-secondary">
        <Building2 className="size-6 text-brand-secondary" aria-hidden="true" />
      </span>

      <div className="space-y-2">
        <h2 className="text-2xl font-extrabold text-brand md:text-3xl">
          {title}
        </h2>
        <p className="text-sm text-[#7f7f7f]">{subtitle}</p>
      </div>
    </div>
  );
}
