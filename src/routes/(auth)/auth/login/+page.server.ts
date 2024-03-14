import type { PageServerLoad, Actions } from "./$types";
import { createAndSetSession } from "$lib/server/auth/auth-utils";
import { loginFormSchema, type LoginFormSchema } from "$validations/auth";
import { message, superValidate } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import { redirect, setFlash } from "sveltekit-flash-message/server";
import { route } from "$lib/ROUTES";
import { getUserByEmail } from "$lib/server/db/users";
import { logger } from "$lib/logger";
import { verifyPassword } from "worker-password-auth";
import { AUTH_METHODS } from "$configs/auth-methods";
import { isAnonymous, validateTurnstileToken, verifyRateLimiter } from "$lib/server/security";
import { loginLimiter } from "$configs/rate-limiters";
import { FLASH_MESSAGE_STATUS } from "$configs/general";
import { fail } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals }) => {
  isAnonymous(locals);

  const form = await superValidate<LoginFormSchema, FlashMessage>(zod(loginFormSchema));

  return { form };
};

export const actions: Actions = {
  default: async (event) => {
    const { request, locals, url, cookies, getClientAddress } = event;
    const flashMessage = { status: FLASH_MESSAGE_STATUS.ERROR, text: "" };

    isAnonymous(locals);

    const retryAfter = await verifyRateLimiter(event, loginLimiter);
    if (retryAfter) {
      flashMessage.text = `Too many requests, retry in ${retryAfter} minutes`;
      logger.debug(flashMessage.text);

      setFlash(flashMessage, cookies);
      return fail(429);
    }

    const form = await superValidate<LoginFormSchema, FlashMessage>(request, zod(loginFormSchema));

    const { email, password, turnstileToken } = form.data;
    form.data.password = "";

    if (!form.valid) {
      flashMessage.text = "Invalid form";
      logger.debug(flashMessage.text);

      return message(form, flashMessage);
    }

    const ip = getClientAddress();
    const validatedTurnstileToken = await validateTurnstileToken(turnstileToken, ip);
    if (!validatedTurnstileToken.success) {
      flashMessage.text = "Invalid turnstile";
      logger.debug(validatedTurnstileToken.error, flashMessage.text);

      return message(form, flashMessage, { status: 400 });
    }

    const existingUser = await getUserByEmail(locals.db, email);
    if (!existingUser) {
      flashMessage.text = "User not found";
      logger.debug(flashMessage.text);

      return message(form, flashMessage, { status: 400 });
    }

    if (!existingUser.password && !existingUser.authMethods.includes(AUTH_METHODS.EMAIL)) {
      flashMessage.text = "You registered with an OAuth provider. Please use the appropriate login method.";
      logger.debug(flashMessage.text);

      return message(form, flashMessage, { status: 403 });
    }

    const validPassword = await verifyPassword(password, existingUser.password ?? "");
    if (!validPassword) {
      flashMessage.text = "Invalid password";
      logger.debug(flashMessage.text);

      return message(form, flashMessage, { status: 400 });
    }

    await createAndSetSession(locals.lucia, existingUser.id, cookies);

    let redirectTo = url.searchParams.get("redirectTo");

    if (redirectTo) {
      // with this line we are forcing to redirect to our domain
      // for example, if they pass a malicious domain like example.com/auth/login?redirectTo=http://virus.com
      // the redirect to the malicious domain won't work because this will throw a 404
      // instead if it's a legit url like example.com/auth/login?redirectTo=/admin it will work as usual
      redirectTo = `/${redirectTo.slice(1)}`;
    }

    redirect(303, redirectTo ?? route("/app/dashboard"));
  }
};
