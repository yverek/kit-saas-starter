import { z } from "zod";
import { NAME_MIN_LEN, NAME_MAX_LEN } from "$configs/fields-length";
import loginFormSchema from "./login-form.schema";

/**
 * This regex checks if name contain only letters and spaces
 */
const nameRegex = /^[a-zA-Z\s]*$/;

// TODO translate this
const registerFormSchema = loginFormSchema
  .extend({
    name: z
      .string({ required_error: "Name is required" })
      .trim()
      .regex(nameRegex, { message: "Name can only contain letters and spaces" })
      .min(NAME_MIN_LEN, { message: `Name must be at least ${NAME_MIN_LEN} characters` })
      .max(NAME_MAX_LEN, { message: `Name must not exceed ${NAME_MAX_LEN} characters` }),
    passwordConfirm: z.string({ required_error: "Password confirm is required" })
  })
  .superRefine(({ password, passwordConfirm }, ctx) => {
    if (passwordConfirm.length > 0 && password !== passwordConfirm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password and password confirm must match",
        path: ["password"]
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password and password confirm must match",
        path: ["passwordConfirm"]
      });
    }
  });

export default registerFormSchema;
