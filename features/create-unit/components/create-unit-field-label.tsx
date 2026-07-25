import { cn } from "@/lib/utils";

type CreateUnitFieldLabelProps = {
  label: string;
  invalid?: boolean;
};

export default function CreateUnitFieldLabel({
  label,
  invalid = false,
}: CreateUnitFieldLabelProps) {
  return (
    <div className="mb-2 flex items-center gap-1.5">
      <label
        className={cn(
          "text-sm font-semibold",
          invalid ? "text-[#c62828]" : "text-brand",
        )}
      >
        {label}
      </label>
      <span className="text-red-500">*</span>
    </div>
  );
}
