import { z } from "zod";
import { PASSWORD_RESET_CODE_LEN, USER_ID_LEN } from "$configs/fields-length";
import { loginFormSchema } from ".";
import type { Infer } from "sveltekit-superforms";

// TODO translate this
const passwordResetFormSchema = loginFormSchema
  .omit({ password: true }) // remove password from login schema
  .extend({
    code: z
      .string({ required_error: "Password reset code is required" })
      .trim()
      .length(PASSWORD_RESET_CODE_LEN, { message: `Password reset code must be ${PASSWORD_RESET_CODE_LEN} characters` }),
    userId: z
      .string({ required_error: "UserId is required" })
      .trim()
      .length(USER_ID_LEN, { message: `User id must be ${USER_ID_LEN} characters` })
  });

type PasswordResetFormSchema = Infer<typeof passwordResetFormSchema>;

//In the first step, we need to verify user email submitted by user
const passwordResetFormSchemaFirstStep = passwordResetFormSchema.pick({ email: true });
type PasswordResetFormSchemaFirstStep = Infer<typeof passwordResetFormSchemaFirstStep>;

// In the second step, we need to verify code submitted by user and hidden userId
const passwordResetFormSchemaSecondStep = passwordResetFormSchema.omit({ email: true });
type PasswordResetFormSchemaSecondStep = Infer<typeof passwordResetFormSchemaSecondStep>;

export {
  passwordResetFormSchema,
  type PasswordResetFormSchema,
  passwordResetFormSchemaFirstStep,
  type PasswordResetFormSchemaFirstStep,
  passwordResetFormSchemaSecondStep,
  type PasswordResetFormSchemaSecondStep
};
