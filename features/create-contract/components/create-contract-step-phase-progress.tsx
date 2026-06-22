import { cn } from "@/lib/utils";

type CreateContractStepPhaseProgressProps = {
  totalPhases: number;
  currentPhaseIndex: number;
};

export default function CreateContractStepPhaseProgress({
  totalPhases,
  currentPhaseIndex,
}: CreateContractStepPhaseProgressProps) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalPhases }, (_, index) => (
        <div
          key={index}
          className={cn(
            "h-1.5 flex-1 overflow-hidden rounded-full bg-[#ececec]",
          )}
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
