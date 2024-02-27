import type { ParamMatcher } from "@sveltejs/kit";

// TODO add check against tokenId
export const match: ParamMatcher = (param) => {
  return true;
};
