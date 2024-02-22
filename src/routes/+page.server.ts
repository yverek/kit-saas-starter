import type { PageServerLoad } from "./$types";
import { users } from "$lib/server/db/schema";
import { count } from "drizzle-orm";

export const load: PageServerLoad = async ({ locals }) => {
  // if (!locals.user) return redirect(302, "/auth/login");

  const allUsers = await locals.db.select({ value: count() }).from(users);

  return { user: locals.user, users: allUsers };
};
