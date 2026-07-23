import { cn } from "@/lib/utils";

type CreatePropertyFieldLabelProps = {
  label: string;
  invalid?: boolean;
  required?: boolean;
};

export default function CreatePropertyFieldLabel({
  label,
  invalid = false,
  required = true,
}: CreatePropertyFieldLabelProps) {
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
      {required ? <span className="text-red-500">*</span> : null}
    </div>
  );
}
