// import { passwordResetFormSchema } from "$validations/auth";
import { passwordResetFormSchema } from "$validations/auth";
import type { ParamMatcher } from "@sveltejs/kit";

export const match: ParamMatcher = (param) => {
  const res = passwordResetFormSchema.pick({ userId: true }).safeParse({ userId: param });

  return res.success;
};
