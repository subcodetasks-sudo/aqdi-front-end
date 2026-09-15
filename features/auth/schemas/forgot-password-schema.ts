import { z } from "zod";

type ForgotPasswordSchemaMessages = {
  phoneRequired: string;
  phoneInvalid: string;
};

export function createForgotPasswordSchema(
  messages: ForgotPasswordSchemaMessages
) {
  return z.object({
    phone: z
      .string()
      .min(1, messages.phoneRequired)
      .refine(
        (value) => /^\+9665\d{8}$/.test(value.replace(/\s/g, "")),
        messages.phoneInvalid
      ),
  });
}

export type ForgotPasswordFormValues = z.infer<
  ReturnType<typeof createForgotPasswordSchema>
>;
