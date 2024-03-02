import { z } from "zod";
import { PASSWORD_MIN_LEN, PASSWORD_MAX_LEN } from "$configs/fields-length";

/**
 * This regex checks if the password is between PASSWORD_MIN_LEN and PASSWORD_MAX_LEN characters.
 * Moreover, it must contain at least
 *  - (?=.*[a-z]) 1 lowercase alphabetical character
 *  - (?=.*[A-Z]) 1 uppercase alphabetical character
 *  - (?=.*[0-9]) 1 numeric character
 *  - (?=.*[!@#$%^&*"'()+,\-./:;<=>?[\]^_`{|}~]) 1 special character
 */
const passwordRegex = new RegExp(
  `^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*"'()+,\\-./:;<=>?[\\]^_\`{|}~])[A-Za-z0-9!@#$%^&*"'()+,\\-./:;<=>?[\\]^_\`{|}~]{${PASSWORD_MIN_LEN},${PASSWORD_MAX_LEN}}$`
);

const passwordField = z
  .string({ required_error: "Password is required" })
  .regex(passwordRegex, {
    message: "Password must be at least 8 characters and must contain at least 1 capital letter, 1 number and 1 special character"
  })
  .min(PASSWORD_MIN_LEN, { message: `Password must be at least ${PASSWORD_MIN_LEN} characters` })
  .max(PASSWORD_MAX_LEN, { message: `Password must not exceed ${PASSWORD_MAX_LEN} characters` });

export { passwordField };
