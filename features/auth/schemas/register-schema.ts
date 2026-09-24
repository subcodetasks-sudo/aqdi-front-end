import { z } from "zod";

type RegisterSchemaMessages = {
  fullNameRequired: string;
  fullNameMin: string;
  phoneRequired: string;
  phoneInvalid: string;
  termsRequired: string;
};

export function createRegisterSchema(messages: RegisterSchemaMessages) {
  return z.object({
    fullName: z
      .string()
      .min(1, messages.fullNameRequired)
      .min(3, messages.fullNameMin),
    phone: z
      .string()
      .min(1, messages.phoneRequired)
      .refine(
        (value) => /^\+9665\d{8}$/.test(value.replace(/\s/g, "")),
        messages.phoneInvalid
      ),
    acceptTerms: z
      .boolean()
      .refine((value) => value === true, messages.termsRequired),
  });
}

export type RegisterFormValues = z.infer<
  ReturnType<typeof createRegisterSchema>
>;
