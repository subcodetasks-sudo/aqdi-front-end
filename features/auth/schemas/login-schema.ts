import { z } from "zod";

type LoginSchemaMessages = {
  phoneRequired: string;
  phoneInvalid: string;
};

export function createLoginSchema(messages: LoginSchemaMessages) {
  return z.object({
    phone: z
      .string()
      .min(1, messages.phoneRequired)
      .refine(
        (value) => /^\+9665\d{8}$/.test(value.replace(/\s/g, "")),
        messages.phoneInvalid
      ),
    rememberMe: z.boolean(),
  });
}

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;
