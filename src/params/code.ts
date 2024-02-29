import { emailValidationFormSchema } from "$validations";
import type { ParamMatcher } from "@sveltejs/kit";

export const match: ParamMatcher = (param) => {
  const res = emailValidationFormSchema.safeParse({ code: param });

  return res.success;
};
