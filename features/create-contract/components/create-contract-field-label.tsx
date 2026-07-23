import { Info } from "lucide-react";

import { cn } from "@/lib/utils";

type CreateContractFieldLabelProps = {
  label: string;
  invalid?: boolean;
  required?: boolean;
};

export default function CreateContractFieldLabel({
  label,
  invalid = false,
  required = true,
}: CreateContractFieldLabelProps) {
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
      {/* <Info className="size-4 text-[#bdbdbd]" aria-hidden="true" /> */}
    </div>
  );
}
