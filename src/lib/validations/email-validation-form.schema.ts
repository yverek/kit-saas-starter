import { z } from "zod";
import { VERIFICATION_CODE_LEN } from "$configs/fields-length";

// TODO translate this
const emailValidationFormSchema = z.object({
  code: z
    .string({ required_error: "Code is required" })
    .trim()
    .length(VERIFICATION_CODE_LEN, { message: `Code must be ${VERIFICATION_CODE_LEN} characters` })
});

export default emailValidationFormSchema;
