import { z } from "zod";
import { PASSWORD_RESET_CODE_LEN } from "$configs/fields-length";

// TODO translate this
const emailValidationFormSchema = z.object({
  code: z
    .string({ required_error: "Password reset code is required" })
    .trim()
    .length(PASSWORD_RESET_CODE_LEN, { message: `Password reset code must be ${PASSWORD_RESET_CODE_LEN} characters` })
});

export default emailValidationFormSchema;
