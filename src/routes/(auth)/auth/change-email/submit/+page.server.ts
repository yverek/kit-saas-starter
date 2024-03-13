import { route } from "$lib/ROUTES";
import type { PageServerLoad } from "./$types";
import type { Actions } from "@sveltejs/kit";
import { changeEmailFormSchemaFirstStep, type ChangeEmailFormSchemaFirstStep } from "$validations/auth";
import { superValidate, message } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import { logger } from "$lib/logger";
import { sendEmailChangeEmail } from "$lib/server/email/send";
import { redirect } from "sveltekit-flash-message/server";
import { generateToken } from "$lib/server/auth/auth-utils";
import { TOKEN_TYPE } from "$lib/server/db/tokens";
import { dev } from "$app/environment";
import { isUserAuthenticated, validateTurnstileToken, verifyRateLimiter } from "$lib/server/security";
import { changeEmailLimiter } from "$configs/rate-limiters";
import type { User } from "lucia";

export const load = (async ({ locals, cookies, url }) => {
  isUserAuthenticated(locals, cookies, url);

  const form = await superValidate<ChangeEmailFormSchemaFirstStep, FlashMessage>(zod(changeEmailFormSchemaFirstStep));

  return { form };
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async (event) => {
    const { request, locals, url, cookies, getClientAddress } = event;

    isUserAuthenticated(locals, cookies, url);

    await verifyRateLimiter(event, changeEmailLimiter);

    const form = await superValidate<ChangeEmailFormSchemaFirstStep, FlashMessage>(request, zod(changeEmailFormSchemaFirstStep));

    if (!form.valid) {
      logger.debug("Invalid form");

      return message(form, { status: "error", text: "Invalid form" });
    }

    const { email: newEmail, turnstileToken } = form.data;
    // ! user is defined here because of "isUserVerified"
    // TODO how can we remove that "as User" casting?
    const { id: userId, name } = locals.user as User;

    const ip = getClientAddress();
    const validatedTurnstileToken = await validateTurnstileToken(turnstileToken, ip);
    if (!validatedTurnstileToken.success) {
      logger.debug(validatedTurnstileToken.error, "Invalid turnstile");

      return message(form, { status: "error", text: "Invalid Turnstile" }, { status: 400 });
    }

    const newToken = await generateToken(locals.db, userId, TOKEN_TYPE.EMAIL_CHANGE);
    if (!newToken) {
      return message(form, { status: "error", text: "Failed to generate change email token" }, { status: 500 });
    }

    const mailSent = await sendEmailChangeEmail(newEmail, name, newToken.token);
    if (!mailSent) {
      return message(form, { status: "error", text: "Failed to send email change mail" }, { status: 500 });
    }

    // TODO export this name into constant
    // TODO this is bad, need to save it server side!
    cookies.set("email_change", newEmail, {
      path: route("/auth/change-email/confirm"),
      secure: !dev,
      httpOnly: true,
      maxAge: 60 * 10, // TODO should we export into a constant?
      sameSite: "lax"
    });

    redirect(route("/auth/change-email/confirm"), { status: "success", text: "Email sent successfully" }, cookies);
  }
};
