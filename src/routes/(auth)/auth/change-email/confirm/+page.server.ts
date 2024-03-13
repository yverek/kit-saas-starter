import { route } from "$lib/ROUTES";
import type { PageServerLoad } from "./$types";
import type { Actions } from "@sveltejs/kit";
import { changeEmailFormSchemaFirstStep, changeEmailFormSchemaSecondStep, type ChangeEmailFormSchemaSecondStep } from "$validations/auth";
import { superValidate, message } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import { logger } from "$lib/logger";
import { updateUserById } from "$lib/server/db/users";
import { redirect } from "sveltekit-flash-message/server";
import { verifyToken } from "$lib/server/auth/auth-utils";
import { TOKEN_TYPE } from "$lib/server/db/tokens";
import { dev } from "$app/environment";
import { isUserAuthenticated, isUserNotVerified, validateTurnstileToken, verifyRateLimiter } from "$lib/server/security";
import { changeEmailLimiter } from "$configs/rate-limiters";
import type { User } from "lucia";

export const load = (async ({ locals, cookies, url }) => {
  isUserNotVerified(locals, cookies, url);

  const form = await superValidate<ChangeEmailFormSchemaSecondStep, FlashMessage>(zod(changeEmailFormSchemaSecondStep));

  return { form };
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async (event) => {
    const { request, locals, url, cookies, getClientAddress } = event;

    isUserAuthenticated(locals, cookies, url);

    await verifyRateLimiter(event, changeEmailLimiter);

    const form = await superValidate<ChangeEmailFormSchemaSecondStep, FlashMessage>(request, zod(changeEmailFormSchemaSecondStep));

    if (!form.valid) {
      logger.debug("Invalid form");

      return message(form, { status: "error", text: "Invalid form" });
    }

    const { token, turnstileToken } = form.data;

    const ip = getClientAddress();
    const validatedTurnstileToken = await validateTurnstileToken(turnstileToken, ip);
    if (!validatedTurnstileToken.success) {
      logger.debug(validatedTurnstileToken.error, "Invalid turnstile");

      return message(form, { status: "error", text: "Invalid Turnstile" }, { status: 400 });
    }

    let newEmail = "";
    // ! user is defined here because of "isUserAuthenticated"
    // TODO how can we remove that "as User" casting?
    const { id: userId } = locals.user as User;
    const newEmailFromCookies = cookies.get("email_change");

    const parsedNewEmail = changeEmailFormSchemaFirstStep.safeParse({ email: newEmailFromCookies });
    if (!parsedNewEmail.success) {
      return message(form, { status: "error", text: "Invalid new email" }, { status: 401 });
    } else {
      newEmail = parsedNewEmail.data.email;
    }

    // TODO export this name into constant
    cookies.delete("email_change", {
      path: route("/auth/change-email/confirm"),
      secure: !dev,
      httpOnly: true,
      maxAge: 60 * 10, // TODO should we export into a constant?
      sameSite: "lax"
    });

    const tokenFromDatabase = await verifyToken(locals.db, userId, token, TOKEN_TYPE.EMAIL_CHANGE);
    if (!tokenFromDatabase) {
      return message(form, { status: "error", text: "Invalid token" }, { status: 500 });
    }

    await locals.lucia.invalidateUserSessions(userId);

    const updatedUser = await updateUserById(locals.db, userId, { email: newEmail });
    if (!updatedUser) {
      return message(form, { status: "error", text: "User not found" }, { status: 404 });
    }

    redirect(route("/auth/login"), { status: "success", text: "Email changed successfully. You can login now!" }, cookies);
  }
};
