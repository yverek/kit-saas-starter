import { z } from "zod";
import { PASSWORD_RESET_CODE_LEN } from "$configs/fields-length";
import { loginFormSchema } from ".";

// TODO translate this
const passwordResetFormSchema = loginFormSchema
  .omit({ password: true }) // remove password from login schema
  .extend({
    code: z
      .string({ required_error: "Password reset code is required" })
      .trim()
      .length(PASSWORD_RESET_CODE_LEN, { message: `Password reset code must be ${PASSWORD_RESET_CODE_LEN} characters` })
  });

export { passwordResetFormSchema };
