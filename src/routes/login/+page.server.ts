import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { eq } from "drizzle-orm";
import { users } from "$lib/server/db/schema";
import { verifyPasswordHash } from "$lib/server/lucia/auth-utils";

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) return redirect(302, "/");
  return {};
};

export const actions: Actions = {
  default: async ({ request, locals, cookies }) => {
    const formData = await request.formData();
    const username = formData.get("username");
    const password = formData.get("password");

    if (typeof username !== "string" || username.length < 3 || username.length > 31 || !/^[a-z0-9_-]+$/.test(username)) {
      return fail(400, { message: "Invalid username" });
    }

    if (typeof password !== "string" || password.length < 6 || password.length > 255) {
      return fail(400, { message: "Invalid password" });
    }

    const existingUser = await locals.db.query.users.findFirst({
      where: eq(users.username, username)
    });

    if (!existingUser) {
      return fail(400, { message: "Incorrect username or password" });
    }

    const validPassword = await verifyPasswordHash(password, existingUser.password);
    if (!validPassword) {
      return fail(400, { message: "Incorrect username or password" });
    }

    const lucia = locals.lucia;
    const session = await lucia.createSession(existingUser.id, {});
    const { name, value, attributes } = lucia.createSessionCookie(session.id);
    cookies.set(name, value, { ...attributes, path: "." });

    return redirect(302, "/");
  }
};
