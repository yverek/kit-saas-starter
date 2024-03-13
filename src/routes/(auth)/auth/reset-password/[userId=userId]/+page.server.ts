import { resetPasswordFormSchemaSecondStep, type ResetPasswordFormSchemaSecondStep } from "$validations/auth";
import { superValidate, message } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { fail, type Actions } from "@sveltejs/kit";
import { logger } from "$lib/logger";
import { route } from "$lib/ROUTES";
import { redirect, setFlash } from "sveltekit-flash-message/server";
import type { PageServerLoad } from "./$types";
import { verifyToken } from "$lib/server/auth/auth-utils";
import { TOKEN_TYPE } from "$lib/server/db/tokens";
import { isAnonymous, validateTurnstileToken, verifyRateLimiter } from "$lib/server/security";
import { resetPasswordLimiter } from "$configs/rate-limiters";
import { FLASH_MESSAGE_STATUS } from "$configs/general";

export const load = (async ({ locals }) => {
  isAnonymous(locals);

  const form = await superValidate<ResetPasswordFormSchemaSecondStep, FlashMessage>(zod(resetPasswordFormSchemaSecondStep));

  return { form };
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async (event) => {
    const { request, locals, cookies, params, getClientAddress } = event;

    isAnonymous(locals);

    const retryAfter = await verifyRateLimiter(event, resetPasswordLimiter);
    if (retryAfter) {
      const flashMessage = { status: FLASH_MESSAGE_STATUS.ERROR, text: `Too many requests, retry in ${retryAfter} minutes` };

      setFlash(flashMessage, cookies);
      return fail(429);
    }

    const form = await superValidate<ResetPasswordFormSchemaSecondStep, FlashMessage>(request, zod(resetPasswordFormSchemaSecondStep));

    if (!form.valid) {
      logger.debug("Invalid form");

      return message(form, { status: "error", text: "Invalid form" });
    }

    const { token, turnstileToken } = form.data;
    const userId = params.userId as string;

    const ip = getClientAddress();
    const validatedTurnstileToken = await validateTurnstileToken(turnstileToken, ip);
    if (!validatedTurnstileToken.success) {
      logger.debug(validatedTurnstileToken.error, "Invalid turnstile");

      return message(form, { status: "error", text: "Invalid Turnstile" }, { status: 400 });
    }

    const isValidToken = await verifyToken(locals.db, userId, token, TOKEN_TYPE.PASSWORD_RESET);
    if (!isValidToken) {
      logger.debug("Invalid token");

      return message(form, { status: "error", text: "Invalid token" });
    }

    redirect(
      route("/auth/reset-password/[userId=userId]/new-password", { userId }),
      { status: "success", text: "You can change your password" },
      cookies
    );
  }
};
