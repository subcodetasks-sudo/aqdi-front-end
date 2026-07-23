import { cn } from "@/lib/utils";

export type FieldChromeState = "default" | "invalid" | "valid";

export function resolveFieldChromeState(options: {
  invalid?: boolean;
  valid?: boolean;
}): FieldChromeState {
  if (options.invalid) {
    return "invalid";
  }

  if (options.valid) {
    return "valid";
  }

  return "default";
}

export function fieldChromeSurfaceClass(
  state: FieldChromeState,
  options?: {
    defaultBgClassName?: string;
  },
) {
  const defaultBg = options?.defaultBgClassName ?? "bg-brand-background";

  return cn(
    state === "invalid" && "border-[#e57373]",
    state === "valid" && "border-brand bg-brand-background-green",
    state === "default" && cn("border-[#e8e8e8]", defaultBg),
    state === "invalid" && defaultBg,
  );
}

export function fieldChromeIconClass(state: FieldChromeState) {
  if (state === "invalid") {
    return "text-[#c62828]";
  }

  if (state === "valid") {
    return "text-brand";
  }

  return "text-brand-secondary";
}
