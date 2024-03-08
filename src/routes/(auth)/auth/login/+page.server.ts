import type { PageServerLoad, Actions } from "./$types";
import { createAndSetSession } from "$lib/server/auth/auth-utils";
import { loginFormSchema, type LoginFormSchema } from "$validations/auth";
import { message, superValidate } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import { redirect } from "sveltekit-flash-message/server";
import { route } from "$lib/ROUTES";
import { getUserByEmail } from "$lib/server/db/users";
import { logger } from "$lib/logger";
import { verifyPassword } from "worker-password-auth";

export const load: PageServerLoad = async ({ locals, cookies }) => {
  if (locals.user) redirect(route("/dashboard"), { status: "success", text: "You are already logged in." }, cookies);

  const form = await superValidate<LoginFormSchema, FlashMessage>(zod(loginFormSchema));

  return { form };
};

export const actions: Actions = {
  default: async ({ request, cookies, url, locals: { db, lucia } }) => {
    const form = await superValidate<LoginFormSchema, FlashMessage>(request, zod(loginFormSchema));

    const { email, password } = form.data;
    form.data.password = "";

    if (!form.valid) {
      logger.debug("Invalid form");

      return message(form, { status: "error", text: "Invalid form" });
    }

    const existingUser = await getUserByEmail(db, email);
    if (!existingUser) {
      logger.debug("User not found");

      return message(form, { status: "error", text: "Incorrect username or password" }, { status: 400 });
    }

    if (!existingUser.password) {
      return message(
        form,
        { status: "error", text: "You registered with an OAuth provider. Please use the appropriate login method." },
        { status: 403 }
      );
    }

    const validPassword = await verifyPassword(password, existingUser.password);
    if (!validPassword) {
      logger.debug("Invalid password");

      return message(form, { status: "error", text: "Incorrect username or password" }, { status: 400 });
    }

    await createAndSetSession(lucia, existingUser.id, cookies);

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
