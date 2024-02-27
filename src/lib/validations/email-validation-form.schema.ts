import { z } from "zod";
import { TOKEN_ID_LEN } from "$configs/fields-length";

// TODO translate this
const emailValidationFormSchema = z.object({
  token: z
    .string({ required_error: "Token is required" })
    .trim()
    .length(TOKEN_ID_LEN, { message: `Token must be ${TOKEN_ID_LEN} characters` })
});

export default emailValidationFormSchema;
