import { redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { eq } from "drizzle-orm";
import { users } from "$lib/server/db/schema";
import { verifyPasswordHash } from "$lib/server/lucia/auth-utils";
import loginFormSchema from "$lib/zod-schemas/login-form.schema";
import { message, superValidate } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) return redirect(302, "/");

  const form = await superValidate(zod(loginFormSchema));

  return { form };
};

export const actions: Actions = {
  default: async ({ request, cookies, url, locals: { db, lucia } }) => {
    const form = await superValidate(request, zod(loginFormSchema));

    if (!form.valid) {
      form.data.password = "";

      return message(form, "Invalid form");
    }

    const { email, password } = form.data;

    const existingUser = await db.query.users.findFirst({ where: eq(users.email, email) });
    if (!existingUser) {
      return message(form, "Incorrect username or password", { status: 400 });
    }

    const validPassword = await verifyPasswordHash(password, existingUser.password);
    if (!validPassword) {
      return message(form, "Incorrect username or password", { status: 400 });
    }

    const session = await lucia.createSession(existingUser.id, {});
    const { name, value, attributes } = lucia.createSessionCookie(session.id);
    cookies.set(name, value, { ...attributes, path: "." });

    let redirectTo = url.searchParams.get("redirectTo");

    if (redirectTo) {
      // with this line we are forcing to redirect to our domain
      // for example, if they pass a malicious domain like example.com/auth/login?redirectTo=http://virus.com
      // the redirect to the malicious domain won't work because this will throw a 404
      // instead if it's a legit url like example.com/auth/login?redirectTo=/admin it will work as usual
      redirectTo = `/${redirectTo.slice(1)}`;
    }

    redirect(303, redirectTo ?? "/dashboard");
  }
};
