import { Info } from "lucide-react";

type CreateUnitFieldLabelProps = {
  label: string;
};

export default function CreateUnitFieldLabel({
  label,
}: CreateUnitFieldLabelProps) {
  return (
    <div className="mb-2 flex items-center gap-1.5">
      <label className="text-sm font-semibold text-brand">{label}</label>
      <span className="text-red-500">*</span>
      <Info className="size-4 text-[#bdbdbd]" aria-hidden="true" />
    </div>
  );
}
