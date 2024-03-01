import { passwordResetFormSchema } from "$validations/auth";
import type { ParamMatcher } from "@sveltejs/kit";

export const match: ParamMatcher = (param) => {
  const res = passwordResetFormSchema.omit({ code: true }).safeParse({ email: param });

  return res.success;
};
