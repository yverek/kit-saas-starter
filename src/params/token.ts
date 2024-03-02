import type { ParamMatcher } from "@sveltejs/kit";
import { tokenSchema } from "$validations/params";

export const match: ParamMatcher = (param) => {
  const res = tokenSchema.safeParse({ code: param });

  return res.success;
};
