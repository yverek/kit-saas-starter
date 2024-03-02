import { z } from "zod";
import type { Infer } from "sveltekit-superforms";
import { userIdField, tokenField, emailField, passwordField, passwordConfirmField, passwordConfirmMustBeEqualToPassword } from "$validations/core";

/**
 * First step
 * We need to verify user email submitted by user
 */
const passwordResetFormSchemaFirstStep = z.object({ email: emailField });
type PasswordResetFormSchemaFirstStep = Infer<typeof passwordResetFormSchemaFirstStep>;

/**
 * Second step
 * We need to verify password and passwordConfirm submitted by user
 */
const passwordResetFormSchemaSecondStep = z.object({ userId: userIdField, token: tokenField });
type PasswordResetFormSchemaSecondStep = Infer<typeof passwordResetFormSchemaSecondStep>;

/**
 * Third step
 * We need to verify password and passwordConfirm submitted by user
 */
const passwordResetFormSchemaThirdStep = z
  .object({ password: passwordField, passwordConfirm: passwordConfirmField })
  .superRefine(passwordConfirmMustBeEqualToPassword);
type PasswordResetFormSchemaThirdStep = Infer<typeof passwordResetFormSchemaThirdStep>;

export {
  passwordResetFormSchemaFirstStep,
  type PasswordResetFormSchemaFirstStep,
  passwordResetFormSchemaSecondStep,
  type PasswordResetFormSchemaSecondStep,
  passwordResetFormSchemaThirdStep,
  type PasswordResetFormSchemaThirdStep
};
