import { z } from "zod";
import { USERNAME_MAX_LEN, USERNAME_MIN_LEN } from "$configs/fields-length";

// TODO add regex that checks for alphanumeric characters only
const usernameField = z
  .string({ required_error: "Username is required" })
  .trim()
  .min(USERNAME_MIN_LEN, { message: `Username must be at least ${USERNAME_MIN_LEN} characters` })
  .max(USERNAME_MAX_LEN, { message: `Username must not exceed ${USERNAME_MAX_LEN} characters` });

export { usernameField };
