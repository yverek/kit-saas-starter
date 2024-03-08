import type { PageServerLoad, Actions } from "./$types";
import { generateId } from "lucia";
import { createAndSetSession, generateEmailVerificationToken } from "$lib/server/auth/auth-utils";
import { registerFormSchema, type RegisterFormSchema } from "$validations/auth";
import { superValidate, message } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import { sendEmailVerificationEmail } from "$lib/server/email/send";
import { redirect } from "sveltekit-flash-message/server";
import { route } from "$lib/ROUTES";
import { logger } from "$lib/logger";
import { createUser } from "$lib/server/db/users";
import { USER_ID_LEN } from "$configs/fields-length";
import { AUTH_METHODS } from "$configs/auth-methods";
import { hashPassword } from "worker-password-auth";

export const load: PageServerLoad = async ({ locals, cookies }) => {
  if (locals.user) redirect(route("/dashboard"), { status: "success", text: "You are already logged in." }, cookies);

  const form = await superValidate<RegisterFormSchema, FlashMessage>(zod(registerFormSchema));

  return { form };
};

export const actions: Actions = {
  default: async ({ request, cookies, locals: { lucia, db } }) => {
    const form = await superValidate<RegisterFormSchema, FlashMessage>(request, zod(registerFormSchema));

    const { name, email, password } = form.data;

    form.data.password = "";
    form.data.passwordConfirm = "";

    if (!form.valid) {
      logger.debug("Invalid form");

      return message(form, { status: "error", text: "Invalid form" });
    }

    const hashedPassword = await hashPassword(password);
    const userId = generateId(USER_ID_LEN);
    const createdAt = new Date();

    const newUser = await createUser(db, {
      id: userId,
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      isAdmin: false,
      createdAt,
      authMethods: [AUTH_METHODS.EMAIL]
    });
    if (!newUser) {
      logger.debug("Failed to insert new user: email already used");

      return message(form, { status: "error", text: "Email already used" }, { status: 400 });
    }

    const token = await generateEmailVerificationToken(db, userId, email);
    if (!token) {
      logger.debug("Failed to generate email verification token");

      return message(form, { status: "error", text: "Failed to generate email verification token" }, { status: 500 });
    }

    const res = await sendEmailVerificationEmail(email, name, token);
    if (!res) {
      logger.debug("Failed to send email");

      return message(form, { status: "error", text: "Failed to send email" }, { status: 500 });
    }

    createAndSetSession(lucia, userId, cookies);

    redirect(route("/auth/verify-email"), { status: "success", text: "Account created. Please check your email to verify your account." }, cookies);
  }
};
