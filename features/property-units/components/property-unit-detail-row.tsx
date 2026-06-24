type PropertyUnitDetailRowProps = {
  label: string;
  value: string;
};

export default function PropertyUnitDetailRow({
  label,
  value,
}: PropertyUnitDetailRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#f0f0f0] py-3 text-sm last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-extrabold text-brand">{value}</span>
    </div>
  );
}
