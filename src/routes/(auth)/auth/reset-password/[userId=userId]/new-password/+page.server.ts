import { logger } from "$lib/logger";
import { resetPasswordFormSchemaThirdStep, type ResetPasswordFormSchemaThirdStep } from "$validations/auth";
import { redirect } from "sveltekit-flash-message/server";
import type { Actions, PageServerLoad } from "./$types";
import { superValidate, message } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { route } from "$lib/ROUTES";
import { updateUserById } from "$lib/server/db/users";
import { hashPassword } from "worker-password-auth";

export const load = (async () => {
  const form = await superValidate<ResetPasswordFormSchemaThirdStep, FlashMessage>(zod(resetPasswordFormSchemaThirdStep));

  return { form };
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async ({ params, request, cookies, locals: { db, lucia } }) => {
    const form = await superValidate<ResetPasswordFormSchemaThirdStep, FlashMessage>(request, zod(resetPasswordFormSchemaThirdStep));

    const { password } = form.data;

    form.data.password = "";
    form.data.passwordConfirm = "";

    if (!form.valid) {
      logger.debug("Invalid form");

      return message(form, { status: "error", text: "Invalid form" });
    }

    const { userId } = params;

    await lucia.invalidateUserSessions(userId);

    const hashedPassword = await hashPassword(password);
    const res = await updateUserById(db, userId, { password: hashedPassword });
    if (!res) {
      return message(form, { status: "error", text: "Error while changing password" }, { status: 500 });
    }

    const status = "success";
    const text = "Password changed successfully. You can now login.";

    redirect(route("/auth/login"), { status, text }, cookies);
  }
};
