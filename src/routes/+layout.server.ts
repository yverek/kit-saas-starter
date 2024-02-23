import { loadFlash } from "sveltekit-flash-message/server";
import type { LayoutServerLoad } from "./$types";

export const load = loadFlash(async () => {
  return {};
}) satisfies LayoutServerLoad;
