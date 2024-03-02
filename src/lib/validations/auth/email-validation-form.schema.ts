import { z } from "zod";
import { tokenField } from "$validations/core";

const emailValidationFormSchema = z.object({ token: tokenField });

export { emailValidationFormSchema };
