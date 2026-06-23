import { cn } from "@/lib/utils";

type CreatePropertyStepPhaseProgressProps = {
  totalPhases: number;
  currentPhaseIndex: number;
};

export default function CreatePropertyStepPhaseProgress({
  totalPhases,
  currentPhaseIndex,
}: CreatePropertyStepPhaseProgressProps) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalPhases }, (_, index) => (
        <div
          key={index}
          className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#ececec]"
        >
          <div
            className={cn(
              "h-full rounded-full bg-brand-secondary transition-all duration-300",
              index <= currentPhaseIndex ? "w-full" : "w-0",
            )}
          />
        </div>
      ))}
    </div>
  );
}
