import type { PageServerLoad, Actions } from "./$types";
import { generateId } from "lucia";
import { createPasswordHash, generateEmailVerificationToken } from "$lib/server/lucia/auth-utils";
import { registerFormSchema, type RegisterFormSchema } from "$validations/auth";
import { superValidate, message } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import { sendEmailVerificationEmail } from "$lib/server/email/send";
import { redirect } from "sveltekit-flash-message/server";
import { route } from "$lib/ROUTES";
import { logger } from "$lib/logger";
import { createNewUser } from "$lib/server/db/users";
import { USER_ID_LEN } from "$configs/fields-length";

export const load: PageServerLoad = async ({ locals, cookies }) => {
  if (locals.user) redirect(route("/dashboard"), { status: "success", text: "You are already logged in." }, cookies);

  const form = await superValidate<RegisterFormSchema, FlashMessage>(zod(registerFormSchema));

  return { form };
};

export const actions: Actions = {
  default: async ({ request, cookies, locals: { lucia, db } }) => {
    const form = await superValidate<RegisterFormSchema, FlashMessage>(request, zod(registerFormSchema));

    if (!form.valid) {
      form.data.password = "";
      form.data.passwordConfirm = "";

      logger.debug("Invalid form");

      return message(form, { status: "error", text: "Invalid form" });
    }

    const { name, email, password } = form.data;

    const hashedPassword = await createPasswordHash(password);
    const userId = generateId(USER_ID_LEN);

    try {
      const newUser = await createNewUser(db, { id: userId, name, email, password: hashedPassword, isVerified: false, isAdmin: false });
      if (!newUser) {
        form.data.password = "";
        form.data.passwordConfirm = "";

        logger.debug("Failed to insert new user: email already used");

        return message(form, { status: "error", text: "Email already used" }, { status: 400 });
      }

      const token = await generateEmailVerificationToken(db, userId, email);
      await sendEmailVerificationEmail(email, name, token);

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

    redirect(route("/auth/verify-email"), { status: "success", text: "Account created. Please check your email to verify your account." }, cookies);
  }
};
