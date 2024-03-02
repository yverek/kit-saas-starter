import { z } from "zod";
import type { Infer } from "sveltekit-superforms";
import { tokenField } from "$validations/core";

const emailValidationFormSchema = z.object({ token: tokenField });

type EmailValidationFormSchema = Infer<typeof emailValidationFormSchema>;

export { emailValidationFormSchema, type EmailValidationFormSchema };
