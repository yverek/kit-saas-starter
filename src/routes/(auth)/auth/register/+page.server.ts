import type { PageServerLoad, Actions } from "./$types";
import { generateId } from "lucia";
import { createPasswordHash } from "$lib/server/lucia/auth-utils";
import registerFormSchema from "$validations/register-form.schema";
import { superValidate, message, type Infer } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import { sendWelcomeEmail } from "$lib/server/email/send";
import { redirect } from "sveltekit-flash-message/server";
import { route } from "$lib/ROUTES";
import { logger } from "$lib/logger";
import { createNewUser } from "$lib/server/db/user";

export const load: PageServerLoad = async ({ locals, cookies }) => {
  if (locals.user) redirect(route("/dashboard"), { status: "success", text: "You are already logged in." }, cookies);

  const form = await superValidate(zod(registerFormSchema));

  return { form };
};

export const actions: Actions = {
  default: async ({ request, cookies, locals: { lucia, db } }) => {
    const form = await superValidate<Infer<typeof registerFormSchema>, FlashMessage>(request, zod(registerFormSchema));

    if (!form.valid) {
      form.data.password = "";
      form.data.passwordConfirm = "";

      logger.debug(form, "Invalid register form");

      return message(form, { status: "error", text: "Invalid form" });
    }

    const { name, email, password } = form.data;

    const hashedPassword = await createPasswordHash(password);
    const userId = generateId(15);

    try {
      const newUser = await createNewUser(db, { id: userId, name, email, password: hashedPassword });
      if (!newUser) {
        form.data.password = "";
        form.data.passwordConfirm = "";

        logger.error("Failed to insert new user: email already used");

        return message(form, { status: "error", text: "Email already used" }, { status: 400 });
      }

      const res = await sendWelcomeEmail(email, name);
      if (!res) {
        form.data.password = "";
        form.data.passwordConfirm = "";

        logger.error(`Failed to send welcome email to ${email}`);

        return message(form, { status: "error", text: "Email not sent" }, { status: 400 });
      }

      const session = await lucia.createSession(userId, {});
      if (session) {
        const { name, value, attributes } = lucia.createSessionCookie(session.id);
        cookies.set(name, value, { ...attributes, path: "/" });
      }
    } catch (e) {
      form.data.password = "";
      form.data.passwordConfirm = "";

      logger.error(e, "Something went wrong using register form");

      return message(form, { status: "error", text: "An unknown error occurred" }, { status: 500 });
    }

    redirect(302, route("/"));
  }
};
