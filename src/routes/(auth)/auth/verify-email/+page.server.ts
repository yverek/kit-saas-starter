import { route } from "$lib/ROUTES";
import type { PageServerLoad } from "./$types";
import { redirect, type Actions } from "@sveltejs/kit";
import { verifyEmailFormSchema, type VerifyEmailFormSchema } from "$validations/auth";
import { superValidate, message } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import { logger } from "$lib/logger";
import { createAndSetSession, verifyToken } from "$lib/server/auth/auth-utils";
import { getUserByEmail, updateUserById } from "$lib/server/db/users";
import { sendWelcomeEmail } from "$lib/server/email/send";
import { AUTH_METHODS } from "$configs/auth-methods";
import { TOKEN_TYPE } from "$lib/server/db/tokens";
import { isUserNotVerified, validateTurnstileToken, verifyRateLimiter } from "$lib/server/security";
import { verifyEmailLimiter } from "$configs/rate-limiters";
import type { User } from "lucia";

export const load = (async ({ locals, cookies, url }) => {
  isUserNotVerified(locals, cookies, url);

  const form = await superValidate<VerifyEmailFormSchema, FlashMessage>(zod(verifyEmailFormSchema));

  return { form };
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async (event) => {
    const { request, locals, url, cookies, getClientAddress } = event;

    isUserNotVerified(locals, cookies, url);

    await verifyRateLimiter(event, verifyEmailLimiter);

    const form = await superValidate<VerifyEmailFormSchema, FlashMessage>(request, zod(verifyEmailFormSchema));

    if (!form.valid) {
      logger.debug("Invalid form");

      return message(form, { status: "error", text: "Invalid form" });
    }

    const { token, turnstileToken } = form.data;
    // ! user is defined here because of "isUserVerified"
    // TODO how can we remove that "as User" casting?
    const { id: userId, email, name } = locals.user as User;

    const ip = getClientAddress();
    const validatedTurnstileToken = await validateTurnstileToken(turnstileToken, ip);
    if (!validatedTurnstileToken.success) {
      logger.debug(validatedTurnstileToken.error, "Invalid turnstile");

      return message(form, { status: "error", text: "Invalid Turnstile" }, { status: 400 });
    }

    const isValidToken = await verifyToken(locals.db, userId, token, TOKEN_TYPE.EMAIL_VERIFICATION);
    if (!isValidToken) {
      return message(form, { status: "error", text: "Invalid token" }, { status: 500 });
    }

    await locals.lucia.invalidateUserSessions(userId);

    const existingUser = await getUserByEmail(locals.db, email);
    if (!existingUser) {
      return message(form, { status: "error", text: "User not found" }, { status: 404 });
    }

    const authMethods = existingUser.authMethods ?? [];
    authMethods.push(AUTH_METHODS.EMAIL);

    const updatedUser = await updateUserById(locals.db, userId, { isVerified: true, authMethods });
    if (!updatedUser) {
      return message(form, { status: "error", text: "User not found" }, { status: 404 });
    }

    await createAndSetSession(locals.lucia, userId, cookies);

    await sendWelcomeEmail(email, name);

    redirect(302, route("/dashboard"));
  }
};
