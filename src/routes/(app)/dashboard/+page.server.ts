import type { PageServerLoad } from "./$types";
import { redirect } from "sveltekit-flash-message/server";

export const load = (async ({ locals, cookies }) => {
  if (!locals.user) redirect("/auth/login", { status: "error", text: "You must be logged in to view the dashboard." }, cookies);

  return {};
}) satisfies PageServerLoad;
