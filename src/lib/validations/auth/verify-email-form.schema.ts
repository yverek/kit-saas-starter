import { z } from "zod";
import type { Infer } from "sveltekit-superforms";
import { tokenField, turnstileTokenField } from "$validations/core";

const verifyEmailFormSchema = z.object({ token: tokenField, turnstileToken: turnstileTokenField });

type VerifyEmailFormSchema = Infer<typeof verifyEmailFormSchema>;

export { verifyEmailFormSchema, type VerifyEmailFormSchema };
