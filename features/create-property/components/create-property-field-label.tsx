type CreatePropertyFieldLabelProps = {
  label: string;
};

export default function CreatePropertyFieldLabel({
  label,
}: CreatePropertyFieldLabelProps) {
  return (
    <div className="mb-2 flex items-center gap-1.5">
      <label className="text-sm font-semibold text-brand">{label}</label>
      <span className="text-red-500">*</span>
    </div>
  );
}
