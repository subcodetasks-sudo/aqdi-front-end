"use client";

import { OTPInputContext } from "input-otp";
import { useContext } from "react";

import { cn } from "@/lib/utils";

type VerifyOtpSlotProps = {
  index: number;
  className?: string;
};

export default function VerifyOtpSlot({ index, className }: VerifyOtpSlotProps) {
  const inputOtpContext = useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOtpContext?.slots[index] ?? {};

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        "relative flex size-12 items-center justify-center rounded-full border border-[#d6d6d6] bg-[#f7f7f7] text-base font-medium transition-all outline-none",
        isActive && "z-10 border-brand ring-3 ring-brand/12",
        className
      )}
    >
      {char ? (
        char
      ) : (
        <span className="text-[#9ca3af]" aria-hidden="true">
          -
        </span>
      )}
      {hasFakeCaret ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      ) : null}
    </div>
  );
}
