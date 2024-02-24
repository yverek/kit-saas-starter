import type { PageServerLoad, Actions } from "./$types";
import { eq } from "drizzle-orm";
import { users } from "$lib/server/db/schema";
import { verifyPasswordHash } from "$lib/server/lucia/auth-utils";
import loginFormSchema from "$lib/zod-schemas/login-form.schema";
import { type Infer, message, superValidate } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import { redirect } from "sveltekit-flash-message/server";
import { route } from "$lib/ROUTES";

export const load: PageServerLoad = async ({ locals, cookies }) => {
  if (locals.user) redirect(route("/dashboard"), { status: "success", text: "You are already logged in." }, cookies);

  const form = await superValidate(zod(loginFormSchema));

  return { form };
};

export const actions: Actions = {
  default: async ({ request, cookies, url, locals: { db, lucia } }) => {
    const form = await superValidate<Infer<typeof loginFormSchema>, FlashMessage>(request, zod(loginFormSchema));

    if (!form.valid) {
      form.data.password = "";

      return message(form, { status: "error", text: "Invalid form" });
    }

    const { email, password } = form.data;

    const existingUser = await db.query.users.findFirst({ where: eq(users.email, email) });
    if (!existingUser) {
      return message(form, { status: "error", text: "Incorrect username or password" }, { status: 400 });
    }

    const validPassword = await verifyPasswordHash(password, existingUser.password);
    if (!validPassword) {
      return message(form, { status: "error", text: "Incorrect username or password" }, { status: 400 });
    }

    const session = await lucia.createSession(existingUser.id, {});
    const { name, value, attributes } = lucia.createSessionCookie(session.id);
    cookies.set(name, value, { ...attributes, path: "/" });

    let redirectTo = url.searchParams.get("redirectTo");

    // TODO this should be a svelte-flash-message?
    if (redirectTo) {
      // with this line we are forcing to redirect to our domain
      // for example, if they pass a malicious domain like example.com/auth/login?redirectTo=http://virus.com
      // the redirect to the malicious domain won't work because this will throw a 404
      // instead if it's a legit url like example.com/auth/login?redirectTo=/admin it will work as usual
      redirectTo = `/${redirectTo.slice(1)}`;
    }

    redirect(303, redirectTo ?? route("/dashboard"));
  }
};
