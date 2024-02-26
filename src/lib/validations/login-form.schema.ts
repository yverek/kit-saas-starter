import { z } from "zod";
import { EMAIL_MIN_LEN, EMAIL_MAX_LEN, PASSWORD_MIN_LEN, PASSWORD_MAX_LEN } from "$configs/fields-length";

/**
 * This regex checks if the password is at least 8 characters.
 * Moreover, it must contain at least
 *  - One capital letter
 *  - One number
 *  - One special character from @ $ ! % * ? & . # ' " : ; , * + = ^ < > _ ` ~
 */
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#'":;,*+=^<>_`~])[A-Za-z\d@$!%*?&.#'":;,*+=^<>_`~]{8,}$/;

// TODO translate this
const loginFormSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Email must be a valid email address" })
    .min(EMAIL_MIN_LEN, { message: `Email must be at least ${EMAIL_MIN_LEN} characters` })
    .max(EMAIL_MAX_LEN, { message: `Email must not exceed ${EMAIL_MAX_LEN} characters` })
    .trim(),
  password: z
    .string({ required_error: "Password is required" })
    .regex(passwordRegex, {
      message: "Password must be at least 8 characters and must contain at least 1 capital letter, 1 number and 1 special character"
    })
    .min(PASSWORD_MIN_LEN, { message: `Password must be at least ${PASSWORD_MIN_LEN} characters` })
    .max(PASSWORD_MAX_LEN, { message: `Password must not exceed ${PASSWORD_MAX_LEN} characters` })
});

export default loginFormSchema;
