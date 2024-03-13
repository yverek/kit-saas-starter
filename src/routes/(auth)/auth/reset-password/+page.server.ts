import { route } from "$lib/ROUTES";
import type { PageServerLoad } from "./$types";
import type { Actions } from "@sveltejs/kit";
import { superValidate, message } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import { logger } from "$lib/logger";
import { resetPasswordFormSchemaFirstStep, type ResetPasswordFormSchemaFirstStep } from "$validations/auth";
import { getUserByEmail } from "$lib/server/db/users";
import { sendPasswordResetEmail } from "$lib/server/email/send";
import { redirect } from "sveltekit-flash-message/server";
import { generateToken } from "$lib/server/auth/auth-utils";
import { TOKEN_TYPE } from "$lib/server/db/tokens";
import { isAnonymous, validateTurnstileToken, verifyRateLimiter } from "$lib/server/security";
import { resetPasswordLimiter } from "$configs/rate-limiters";

export const load = (async ({ locals }) => {
  isAnonymous(locals);

  const form = await superValidate<ResetPasswordFormSchemaFirstStep, FlashMessage>(zod(resetPasswordFormSchemaFirstStep));

  return { form };
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async (event) => {
    const { cookies, request, getClientAddress, locals } = event;

    isAnonymous(locals);

    await verifyRateLimiter(event, resetPasswordLimiter);

    const form = await superValidate<ResetPasswordFormSchemaFirstStep, FlashMessage>(request, zod(resetPasswordFormSchemaFirstStep));

    if (!form.valid) {
      logger.debug(form, "Invalid email for password reset form");

      return message(form, { status: "error", text: "Invalid form" });
    }

    const { email, turnstileToken } = form.data;

    const ip = getClientAddress();
    const validatedTurnstileToken = await validateTurnstileToken(turnstileToken, ip);
    if (!validatedTurnstileToken.success) {
      logger.debug(validatedTurnstileToken.error, "Invalid turnstile");

      return message(form, { status: "error", text: "Invalid Turnstile" }, { status: 400 });
    }

    const userFromDb = await getUserByEmail(locals.db, email);
    if (!userFromDb) {
      // we send a success message even if the user doesn't exist to prevent email enumeration
      redirect(route("/"), { status: "success", text: "Email sent successfully" }, cookies);
    }

    const { id: userId } = userFromDb;

    const newToken = await generateToken(locals.db, userId, TOKEN_TYPE.PASSWORD_RESET);
    if (!newToken) {
      return message(form, { status: "error", text: "Failed to generate password reset token" }, { status: 500 });
    }

    const mailSent = await sendPasswordResetEmail(email, newToken.token);
    if (!mailSent) {
      return message(form, { status: "error", text: "Failed to send password reset mail" }, { status: 500 });
    }

    // TODO fix this, can't see toast message
    redirect(route("/auth/reset-password/[userId=userId]", { userId }), { status: "success", text: "Email send successfully" }, cookies);
  }
};
