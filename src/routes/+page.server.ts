import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { users } from "$lib/server/db/schema";
import { count } from "drizzle-orm";

export const load: PageServerLoad = async ({ locals }) => {
  // if (!locals.user) return redirect(302, "/auth/login");

  const allUsers = await locals.db.select({ value: count() }).from(users);

  return { user: locals.user, users: allUsers };
};

export const actions: Actions = {
  default: async ({ locals, cookies }) => {
    if (!locals.session) {
      return fail(401);
    }

    const lucia = locals.lucia;
    await lucia.invalidateSession(locals.session.id);
    const { name, value, attributes } = lucia.createBlankSessionCookie();
    cookies.set(name, value, { ...attributes, path: "." });

    return redirect(302, "/login");
  }
};
