import { z } from "zod";

type ResetPasswordSchemaMessages = {
  passwordRequired: string;
  passwordMin: string;
  confirmPasswordRequired: string;
  passwordsMismatch: string;
};

export function createResetPasswordSchema(messages: ResetPasswordSchemaMessages) {
  return z
    .object({
      password: z
        .string()
        .min(1, messages.passwordRequired)
        .min(8, messages.passwordMin),
      confirmPassword: z.string().min(1, messages.confirmPasswordRequired),
    })
    .refine((values) => values.password === values.confirmPassword, {
      message: messages.passwordsMismatch,
      path: ["confirmPassword"],
    });
}

export type ResetPasswordFormValues = z.infer<
  ReturnType<typeof createResetPasswordSchema>
>;
