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
import { validateTurnstileToken, verifyRateLimiter } from "$lib/server/security";
import { RetryAfterRateLimiter } from "sveltekit-rate-limiter/server";
import { CHANGE_EMAIL_LIMITER_COOKIE_NAME } from "$configs/cookies-names";
import { RATE_LIMITER_SECRET_KEY } from "$env/static/private";

export const changeEmailLimiter = new RetryAfterRateLimiter({
  rates: {
    IP: [5, "h"],
    IPUA: [5, "h"],
    cookie: {
      name: CHANGE_EMAIL_LIMITER_COOKIE_NAME,
      secret: RATE_LIMITER_SECRET_KEY,
      rate: [5, "h"],
      preflight: true
    }
  }
});

export const load = (async (event) => {
  await changeEmailLimiter.cookieLimiter?.preflight(event);

  if (!event.locals.user) redirect(302, route("/auth/login"));

  const form = await superValidate<ChangeEmailFormSchemaFirstStep, FlashMessage>(zod(changeEmailFormSchemaFirstStep));

  return { form };
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async (event) => {
    const {
      request,
      cookies,
      getClientAddress,
      locals: { db, user }
    } = event;

    verifyRateLimiter(event, changeEmailLimiter);

    if (!user) redirect(302, route("/auth/login"));

    const form = await superValidate<ChangeEmailFormSchemaFirstStep, FlashMessage>(request, zod(changeEmailFormSchemaFirstStep));

    if (!form.valid) {
      logger.debug("Invalid form");

      return message(form, { status: "error", text: "Invalid form" });
    }

    const { email: newEmail, turnstileToken } = form.data;
    const { id: userId, name } = user;

    const ip = getClientAddress();
    const validatedTurnstileToken = await validateTurnstileToken(turnstileToken, ip);
    if (!validatedTurnstileToken.success) {
      logger.debug(validatedTurnstileToken.error, "Invalid turnstile");

      return message(form, { status: "error", text: "Invalid Turnstile" }, { status: 400 });
    }

    const newToken = await generateToken(db, userId, TOKEN_TYPE.EMAIL_CHANGE);
    if (!newToken) {
      return message(form, { status: "error", text: "Failed to generate change email token" }, { status: 500 });
    }

    const mailSent = await sendEmailChangeEmail(newEmail, name, newToken.token);
    if (!mailSent) {
      return message(form, { status: "error", text: "Failed to send email change mail" }, { status: 500 });
    }

    // TODO export this name into constant
    cookies.set("email_change", newEmail, {
      path: route("/auth/change-email/confirm"),
      secure: !dev,
      httpOnly: true,
      maxAge: 60 * 10, // TODO should we export into a constant?
      sameSite: "lax"
    });

    // TODO fix this, can't see toast message
    redirect(route("/auth/change-email/confirm"), { status: "success", text: "Email sent successfully" }, cookies);
  }
};
