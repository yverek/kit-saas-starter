import { route } from "$lib/ROUTES";
import type { PageServerLoad } from "./$types";
import { fail, type Actions } from "@sveltejs/kit";
import { changeEmailFormSchemaSecondStep, type ChangeEmailFormSchemaSecondStep } from "$validations/auth";
import { superValidate, message } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import { logger } from "$lib/logger";
import { updateUserById } from "$lib/server/db/users";
import { redirect, setFlash } from "sveltekit-flash-message/server";
import { generateToken, verifyToken } from "$lib/server/auth/auth-utils";
import { TOKEN_TYPE } from "$lib/server/db/tokens";
import { isUserAuthenticated, validateTurnstileToken, verifyRateLimiter } from "$lib/server/security";
import { changeEmailLimiter } from "$configs/rate-limiters";
import type { User } from "lucia";
import { FLASH_MESSAGE_STATUS } from "$configs/general";
import { sendEmailChangeEmail } from "$lib/server/email/send";
import { resendEmailLimiter } from "$configs/rate-limiters/resend-email.limiter";

export const load = (async ({ locals, cookies, url }) => {
  isUserAuthenticated(locals, cookies, url);

  const form = await superValidate<ChangeEmailFormSchemaSecondStep, FlashMessage>(zod(changeEmailFormSchemaSecondStep));

  return { form };
}) satisfies PageServerLoad;

export const actions: Actions = {
  confirm: async (event) => {
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

    const form = await superValidate<ChangeEmailFormSchemaSecondStep, FlashMessage>(request, zod(changeEmailFormSchemaSecondStep));
    if (!form.valid) {
      flashMessage.text = "Invalid form";
      logger.debug(flashMessage.text);

      return message(form, flashMessage);
    }

    const { token, turnstileToken } = form.data;
    const ip = getClientAddress();

    const validatedTurnstileToken = await validateTurnstileToken(turnstileToken, ip);
    if (!validatedTurnstileToken.success) {
      flashMessage.text = "Invalid Turnstile";
      logger.debug(validatedTurnstileToken.error, flashMessage.text);

      return message(form, flashMessage, { status: 400 });
    }

    // ! user is defined here because of "isUserAuthenticated"
    // TODO how can we remove that "as User" casting?
    const { id: userId } = locals.user as User;

    // TODO export this name into constant
    const newEmail = await event.platform?.env.KV.get(`change-email-${userId}`);
    if (!newEmail) {
      flashMessage.text = "Invalid new email";
      logger.debug("Failed to retrieve email from KV");

      return message(form, flashMessage, { status: 401 });
    }

    const tokenFromDatabase = await verifyToken(locals.db, userId, token, TOKEN_TYPE.EMAIL_CHANGE);
    if (!tokenFromDatabase) {
      flashMessage.text = "Invalid token";
      logger.debug("Failed to retrieve token from db");

      return message(form, flashMessage, { status: 500 });
    }

    await locals.lucia.invalidateUserSessions(userId);

    const updatedUser = await updateUserById(locals.db, userId, { email: newEmail });
    if (!updatedUser) {
      flashMessage.text = "User not found";
      logger.debug("Failed to update user");

      return message(form, flashMessage, { status: 404 });
    }

    flashMessage.status = FLASH_MESSAGE_STATUS.SUCCESS;
    flashMessage.text = "Email changed successfully. You can login now!";

    redirect(route("/auth/login"), flashMessage, cookies);
  },

  resendEmail: async (event) => {
    const { locals, url, cookies, platform } = event;
    const flashMessage = { status: FLASH_MESSAGE_STATUS.ERROR, text: "" };

    isUserAuthenticated(locals, cookies, url);

    const retryAfter = await verifyRateLimiter(event, resendEmailLimiter);
    if (retryAfter) {
      flashMessage.text = `Too many requests, retry in ${retryAfter} minutes`;
      logger.debug(flashMessage.text);

      setFlash(flashMessage, cookies);
      return fail(429);
    }

    // ! user is defined here because of "isUserVerified"
    // TODO how can we remove that "as User" casting?
    const { id: userId, name } = locals.user as User;

    // TODO export this name into constant
    const newEmail = await platform?.env.KV.get(`change-email-${userId}`);
    if (!newEmail) {
      flashMessage.text = "Invalid new email";
      logger.debug(flashMessage.text);

      setFlash(flashMessage, cookies);
      return fail(401);
    }

    const newToken = await generateToken(locals.db, userId, TOKEN_TYPE.EMAIL_CHANGE);
    if (!newToken) {
      flashMessage.text = "Failed to generate token";
      logger.debug(flashMessage.text);

      setFlash(flashMessage, cookies);
      return fail(500);
    }

    const mailSent = await sendEmailChangeEmail(newEmail, name, newToken.token);
    if (!mailSent) {
      flashMessage.text = "Failed to send email";
      logger.debug(flashMessage.text);

      setFlash(flashMessage, cookies);
      return fail(500);
    }

    flashMessage.status = FLASH_MESSAGE_STATUS.SUCCESS;
    flashMessage.text = "Email sent successfully";

    redirect(route("/auth/change-email/confirm"), flashMessage, cookies);
  }
};
