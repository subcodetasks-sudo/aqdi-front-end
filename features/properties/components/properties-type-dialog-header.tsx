import CustomIcon from "@/features/shared/components/custom-icon";

type PropertiesTypeDialogHeaderProps = {
  mainTitle: string;
  subtitle: string;
  iconAlt: string;
};

export default function PropertiesTypeDialogHeader({
  mainTitle,
  subtitle,
  iconAlt,
}: PropertiesTypeDialogHeaderProps) {
  return (
    <div className="space-y-4 text-center">
      <div className="flex justify-center">
        <div
          className="relative flex size-16 items-center justify-center rounded-full bg-brand shadow-[0_0_24px_rgba(13,179,139,0.35)]"
          aria-hidden="true"
        >
          <CustomIcon src="/icons/file-write.svg" size={28} className="text-white" />
        </div>
      </div>

      <div className="space-y-2">
        <span className="sr-only">{iconAlt}</span>
        <h2 className="text-lg font-bold text-brand md:text-xl">{mainTitle}</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}
