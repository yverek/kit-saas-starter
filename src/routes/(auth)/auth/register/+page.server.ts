import type { PageServerLoad, Actions } from "./$types";
import { generateId } from "lucia";
import { createAndSetSession, generateToken } from "$lib/server/auth/auth-utils";
import { registerFormSchema, type RegisterFormSchema } from "$validations/auth";
import { superValidate, message } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import { sendEmailVerificationEmail } from "$lib/server/email/send";
import { redirect, setFlash } from "sveltekit-flash-message/server";
import { route } from "$lib/ROUTES";
import { logger } from "$lib/logger";
import { createUser, getUserByEmail, updateUserById } from "$lib/server/db/users";
import { USER_ID_LEN } from "$configs/fields-length";
import { AUTH_METHODS } from "$configs/auth-methods";
import { hashPassword } from "worker-password-auth";
import { TOKEN_TYPE } from "$lib/server/db/tokens";
import { isAnonymous, validateTurnstileToken, verifyRateLimiter } from "$lib/server/security";
import { registerLimiter } from "$configs/rate-limiters";
import { FLASH_MESSAGE_STATUS } from "$configs/general";
import { fail } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals }) => {
  isAnonymous(locals);

  const form = await superValidate<RegisterFormSchema, FlashMessage>(zod(registerFormSchema));

  return { form };
};

export const actions: Actions = {
  default: async (event) => {
    const { request, locals, cookies, getClientAddress } = event;
    const flashMessage = { status: FLASH_MESSAGE_STATUS.ERROR, text: "" };

    isAnonymous(locals);

    const retryAfter = await verifyRateLimiter(event, registerLimiter);
    if (retryAfter) {
      flashMessage.text = `Too many requests, retry in ${retryAfter} minutes`;
      logger.debug(flashMessage.text);

      setFlash(flashMessage, cookies);
      return fail(429);
    }

    const form = await superValidate<RegisterFormSchema, FlashMessage>(request, zod(registerFormSchema));

    const { name, email, password, turnstileToken } = form.data;

    form.data.password = "";
    form.data.passwordConfirm = "";

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
    if (existingUser && existingUser.authMethods.includes(AUTH_METHODS.EMAIL)) {
      flashMessage.text = "This email is already in user. Please do login.";
      logger.debug(flashMessage.text);

      return message(form, flashMessage, { status: 400 });
    }

    const userId = existingUser?.id ?? generateId(USER_ID_LEN);
    const hashedPassword = await hashPassword(password);

    if (!existingUser) {
      const newUser = await createUser(locals.db, {
        id: userId,
        name,
        email,
        password: hashedPassword,
        isVerified: false,
        isAdmin: false,
        authMethods: []
      });

      if (!newUser) {
        flashMessage.text = "Failed to insert new user: email already used";
        logger.debug(flashMessage.text);

        return message(form, flashMessage, { status: 400 });
      }
    } else {
      const updatedUser = await updateUserById(locals.db, existingUser.id, { password: hashedPassword });

      if (!updatedUser) {
        flashMessage.text = "Failed to insert new user: email already used";
        logger.debug(flashMessage.text);

        return message(form, flashMessage, { status: 400 });
      }
    }

    const newToken = await generateToken(locals.db, userId, TOKEN_TYPE.EMAIL_VERIFICATION);
    if (!newToken) {
      flashMessage.text = "Failed to generate email verification token";
      logger.debug(flashMessage.text);

      return message(form, flashMessage, { status: 500 });
    }

    const res = await sendEmailVerificationEmail(email, name, newToken.token);
    if (!res) {
      flashMessage.text = "Failed to send email";
      logger.debug(flashMessage.text);

      return message(form, flashMessage, { status: 500 });
    }

    await createAndSetSession(locals.lucia, userId, cookies);

    redirect(route("/auth/verify-email"), { status: "success", text: "Account created. Please check your email to verify your account." }, cookies);
  }
};
