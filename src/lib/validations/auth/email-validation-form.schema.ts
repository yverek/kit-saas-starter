import { z } from "zod";
import { VERIFICATION_CODE_LEN } from "$configs/fields-length";

// TODO translate this
const emailValidationFormSchema = z.object({
  code: z
    .string({ required_error: "Email validation code is required" })
    .trim()
    .length(VERIFICATION_CODE_LEN, { message: `Email validation code must be ${VERIFICATION_CODE_LEN} characters` })
});

export default emailValidationFormSchema;
