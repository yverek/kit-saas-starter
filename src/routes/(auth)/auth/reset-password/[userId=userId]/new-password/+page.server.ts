import { logger } from "$lib/logger";
import { resetPasswordFormSchemaThirdStep, type ResetPasswordFormSchemaThirdStep } from "$validations/auth";
import { redirect, setFlash } from "sveltekit-flash-message/server";
import type { Actions, PageServerLoad } from "./$types";
import { superValidate, message } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { route } from "$lib/ROUTES";
import { updateUserById } from "$lib/server/db/users";
import { hashPassword } from "worker-password-auth";
import { isAnonymous, validateTurnstileToken, verifyRateLimiter } from "$lib/server/security";
import { resetPasswordLimiter } from "$configs/rate-limiters";
import { FLASH_MESSAGE_STATUS } from "$configs/general";
import { fail } from "@sveltejs/kit";

export const load = (async ({ locals }) => {
  isAnonymous(locals);

  const form = await superValidate<ResetPasswordFormSchemaThirdStep, FlashMessage>(zod(resetPasswordFormSchemaThirdStep));

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

    const form = await superValidate<ResetPasswordFormSchemaThirdStep, FlashMessage>(request, zod(resetPasswordFormSchemaThirdStep));

    const { password, turnstileToken } = form.data;

    form.data.password = "";
    form.data.passwordConfirm = "";

    if (!form.valid) {
      logger.debug("Invalid form");

      return message(form, { status: "error", text: "Invalid form" });
    }

    const ip = getClientAddress();
    const validatedTurnstileToken = await validateTurnstileToken(turnstileToken, ip);
    if (!validatedTurnstileToken.success) {
      logger.debug(validatedTurnstileToken.error, "Invalid turnstile");

      return message(form, { status: "error", text: "Invalid Turnstile" }, { status: 400 });
    }

    const { userId } = params;

    await locals.lucia.invalidateUserSessions(userId);

    const hashedPassword = await hashPassword(password);
    const updatedUser = await updateUserById(locals.db, userId, { password: hashedPassword });
    if (!updatedUser) {
      return message(form, { status: "error", text: "Error while changing password" }, { status: 500 });
    }

    redirect(route("/auth/login"), { status: "success", text: "Password changed successfully. You can now login." }, cookies);
  }
};
