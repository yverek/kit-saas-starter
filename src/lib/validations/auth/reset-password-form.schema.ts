import { z } from "zod";
import type { Infer } from "sveltekit-superforms";
import {
  tokenField,
  emailField,
  passwordField,
  passwordConfirmField,
  passwordConfirmMustBeEqualToPassword,
  turnstileTokenField
} from "$validations/core";

/**
 * First step
 * We need to verify the email submitted by user
 */
const resetPasswordFormSchemaFirstStep = z.object({ email: emailField, turnstileToken: turnstileTokenField });
type ResetPasswordFormSchemaFirstStep = Infer<typeof resetPasswordFormSchemaFirstStep>;

/**
 * Second step
 * We need to verify the token submitted by user
 */
const resetPasswordFormSchemaSecondStep = z.object({ token: tokenField, turnstileToken: turnstileTokenField });
type ResetPasswordFormSchemaSecondStep = Infer<typeof resetPasswordFormSchemaSecondStep>;

/**
 * Third step
 * We need to verify both password and passwordConfirm submitted by user
 */
const resetPasswordFormSchemaThirdStep = z
  .object({ password: passwordField, passwordConfirm: passwordConfirmField, turnstileToken: turnstileTokenField })
  .superRefine(passwordConfirmMustBeEqualToPassword);
type ResetPasswordFormSchemaThirdStep = Infer<typeof resetPasswordFormSchemaThirdStep>;

export {
  resetPasswordFormSchemaFirstStep,
  type ResetPasswordFormSchemaFirstStep,
  resetPasswordFormSchemaSecondStep,
  type ResetPasswordFormSchemaSecondStep,
  resetPasswordFormSchemaThirdStep,
  type ResetPasswordFormSchemaThirdStep
};
