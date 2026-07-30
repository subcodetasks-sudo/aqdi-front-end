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
  const defaultBg = options?.defaultBgClassName ?? "bg-[#FBFBFA]";

  return cn(
    state === "invalid" && "border-[#e57373]",
    state === "valid" && "border-brand bg-brand-background-green",
    state === "default" && cn("border-[#e8e8e8]", defaultBg),
    state === "invalid" && defaultBg,
  );
}

/** Nested Input inside a chrome wrapper — keep a11y invalid, kill extra border/ring. */
export const fieldChromeNestedInputClass =
  "border-0 bg-transparent shadow-none focus-visible:border-0 focus-visible:ring-0 aria-invalid:border-0 aria-invalid:ring-0 dark:aria-invalid:border-0 dark:aria-invalid:ring-0";

/** Input/textarea that is itself the chrome surface — one border only. */
export const fieldChromeControlClass =
  "shadow-none focus-visible:ring-0 aria-invalid:border-[#e57373] aria-invalid:ring-0 dark:aria-invalid:border-[#e57373] dark:aria-invalid:ring-0";

export function fieldChromeIconClass(state: FieldChromeState) {
  if (state === "invalid") {
    return "text-[#c62828]";
  }

  if (state === "valid") {
    return "text-brand";
  }

  return "text-brand-secondary";
}
