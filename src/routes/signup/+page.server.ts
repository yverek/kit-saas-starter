import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { generateId } from "lucia";
import { users } from "$lib/server/db/schema";
import { createPasswordHash } from "$lib/server/lucia/auth-utils";

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

    const hashedPassword = await createPasswordHash(password);
    console.log("🚀 ~ hashedPassword:", hashedPassword);
    const userId = generateId(15);
    console.log("🚀 ~ userId:", userId);

    try {
      const test = await locals.db.query.users.findMany();
      console.log("🚀 ~ test:", test);
      await locals.db.insert(users).values({
        id: userId,
        username,
        password: hashedPassword
      });

      const lucia = locals.lucia;

      const session = await lucia.createSession(userId, {});
      const { name, value, attributes } = lucia.createSessionCookie(session.id);
      cookies.set(name, value, { ...attributes, path: "." });
    } catch (e) {
      console.log("🚀 ~ e:", e);
      if (e instanceof Error && e.message === `D1_ERROR: UNIQUE constraint failed: users.username`) {
        return fail(400, { message: "Username already used" });
      }

      return fail(500, { message: "An unknown error occurred" });
    }

    return redirect(302, "/");
  }
};
