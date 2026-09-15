import { z } from "zod";

type VerifyOtpSchemaMessages = {
  otpRequired: string;
  otpInvalid: string;
};

export function createVerifyOtpSchema(messages: VerifyOtpSchemaMessages) {
  return z.object({
    otp: z
      .string()
      .min(1, messages.otpRequired)
      .regex(/^\d{4}$/, messages.otpInvalid),
  });
}

export type VerifyOtpFormValues = z.infer<
  ReturnType<typeof createVerifyOtpSchema>
>;
