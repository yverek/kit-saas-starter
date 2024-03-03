import { route } from "$lib/ROUTES";
import type { PageServerLoad } from "./$types";
import { redirect, type Actions } from "@sveltejs/kit";
import { emailValidationFormSchema, type EmailValidationFormSchema } from "$validations/auth";
import { superValidate, message } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import { logger } from "$lib/logger";
import { verifyEmailVerificationToken } from "$lib/server/lucia/auth-utils";
import { updateUserById } from "$lib/server/db/users";
import { sendWelcomeEmail } from "$lib/server/email/send";
import { SESSION_ID_LEN } from "$configs/fields-length";
import { generateId } from "lucia";

export const load = (async ({ locals: { user } }) => {
  if (!user) redirect(302, route("/auth/login"));
  if (user.isVerified) redirect(302, route("/dashboard"));

  const form = await superValidate<EmailValidationFormSchema, FlashMessage>(zod(emailValidationFormSchema));

  return { form };
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async ({ cookies, request, locals: { db, user, lucia } }) => {
    const form = await superValidate<EmailValidationFormSchema, FlashMessage>(request, zod(emailValidationFormSchema));

    if (!form.valid) {
      logger.debug("Invalid form");

      return message(form, { status: "error", text: "Invalid form" });
    }

    const { token } = form.data;
    if (!user) redirect(302, route("/auth/login"));

    const isValidToken = await verifyEmailVerificationToken(db, user.id, user.email, token);
    if (!isValidToken) {
      return message(form, { status: "error", text: "Invalid token" }, { status: 500 });
    }

    await lucia.invalidateUserSessions(user.id);

    const res = await updateUserById(db, user.id, { isVerified: true });
    if (!res) {
      return message(form, { status: "error", text: "User not found" }, { status: 404 });
    }

    const sessionId = generateId(SESSION_ID_LEN);
    const session = await lucia.createSession(user.id, {}, { sessionId });
    const { name, value, attributes } = lucia.createSessionCookie(session.id);
    cookies.set(name, value, { ...attributes, path: "/" });

    await sendWelcomeEmail(user.email, user.name);

    redirect(302, route("/dashboard"));
  }
};
