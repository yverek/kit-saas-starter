import { logger } from "$lib/logger";
import { passwordResetFormSchemaThirdStep, type PasswordResetFormSchemaThirdStep } from "$validations/auth";
import { redirect } from "sveltekit-flash-message/server";
import type { Actions, PageServerLoad } from "./$types";
import { superValidate, message } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { route } from "$lib/ROUTES";
import { createPasswordHash } from "$lib/server/lucia/auth-utils";
import { updateUserById } from "$lib/server/db/users";

export const load = (async () => {
  const form = await superValidate<PasswordResetFormSchemaThirdStep, FlashMessage>(zod(passwordResetFormSchemaThirdStep));

  return { form };
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async ({ params, request, cookies, locals: { db, lucia } }) => {
    const form = await superValidate<PasswordResetFormSchemaThirdStep, FlashMessage>(request, zod(passwordResetFormSchemaThirdStep));

    if (!form.valid) {
      form.data.password = "";
      form.data.passwordConfirm = "";

      logger.debug("Invalid form");

      return message(form, { status: "error", text: "Invalid form" });
    }

    const { password } = form.data;
    const { userId } = params;

    await lucia.invalidateUserSessions(userId);

    const hashedPassword = await createPasswordHash(password);
    const res = await updateUserById(db, userId, { password: hashedPassword });
    if (!res) {
      return message(form, { status: "error", text: "Error while changing password" }, { status: 500 });
    }

    const status = "success";
    const text = "Password changed successfully. You can now login.";

    redirect(route("/auth/login"), { status, text }, cookies);
  }
};
