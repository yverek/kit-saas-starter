import { route } from "$lib/ROUTES";
import type { PageServerLoad } from "./$types";
import { fail, type Actions } from "@sveltejs/kit";
import { changeEmailFormSchemaFirstStep, type ChangeEmailFormSchemaFirstStep } from "$validations/auth";
import { superValidate, message } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import { logger } from "$lib/logger";
import { sendEmailChangeEmail } from "$lib/server/email/send";
import { redirect, setFlash } from "sveltekit-flash-message/server";
import { generateToken } from "$lib/server/auth/auth-utils";
import { TOKEN_TYPE } from "$lib/server/db/tokens";
import { isUserAuthenticated, validateTurnstileToken, verifyRateLimiter } from "$lib/server/security";
import { changeEmailLimiter } from "$configs/rate-limiters/auth";
import type { User } from "lucia";
import { FLASH_MESSAGE_STATUS } from "$configs/general";
import { getUserByEmail } from "$lib/server/db/users";

export const load = (async ({ locals, cookies, url }) => {
  isUserAuthenticated(locals, cookies, url);

  const form = await superValidate<ChangeEmailFormSchemaFirstStep, FlashMessage>(zod(changeEmailFormSchemaFirstStep));

  return { form };
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async (event) => {
    const { request, locals, url, cookies, getClientAddress } = event;
    const flashMessage = { status: FLASH_MESSAGE_STATUS.ERROR, text: "" };

    isUserAuthenticated(locals, cookies, url);

    const retryAfter = await verifyRateLimiter(event, changeEmailLimiter);
    if (retryAfter) {
      flashMessage.text = `Too many requests, retry in ${retryAfter} minutes`;
      logger.debug(flashMessage.text);

      setFlash(flashMessage, cookies);
      return fail(429);
    }

    const form = await superValidate<ChangeEmailFormSchemaFirstStep, FlashMessage>(request, zod(changeEmailFormSchemaFirstStep));
    if (!form.valid) {
      flashMessage.text = "Invalid form";
      logger.debug(flashMessage.text);

      return message(form, flashMessage);
    }

    // ! user is defined here because of "isUserVerified"
    // TODO how can we remove that "as User" casting?
    const { id: userId, name } = locals.user as User;
    const { email: newEmail, turnstileToken } = form.data;

    const ip = getClientAddress();
    const validatedTurnstileToken = await validateTurnstileToken(turnstileToken, ip);
    if (!validatedTurnstileToken.success) {
      flashMessage.text = "Invalid turnstile";
      logger.debug(validatedTurnstileToken.error, flashMessage.text);

      return message(form, flashMessage, { status: 400 });
    }

    const existingUser = await getUserByEmail(locals.db, newEmail);
    if (existingUser) {
      flashMessage.text = "Email already used";
      logger.debug(flashMessage.text);

      return message(form, flashMessage, { status: 401 });
    }

    const newToken = await generateToken(locals.db, userId, newEmail, TOKEN_TYPE.EMAIL_CHANGE);
    if (!newToken) {
      flashMessage.text = "Failed to generate token";
      logger.debug(flashMessage.text);

      return message(form, flashMessage, { status: 500 });
    }

    const mailSent = await sendEmailChangeEmail(newEmail, name, newToken.token);
    if (!mailSent) {
      flashMessage.text = "Failed to send email";
      logger.debug(flashMessage.text);

      return message(form, flashMessage, { status: 500 });
    }

    flashMessage.status = FLASH_MESSAGE_STATUS.SUCCESS;
    flashMessage.text = "Email sent successfully";

    redirect(route("/auth/change-email/confirm"), flashMessage, cookies);
  }
};
