import { logger } from "$lib/logger";
import { passwordResetFormSchemaThirdStep, type PasswordResetFormSchemaThirdStep } from "$validations/auth";
import { redirect } from "sveltekit-flash-message/server";
import type { Actions, PageServerLoad } from "./$types";
import { superValidate, message } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { route } from "$lib/ROUTES";

export const load = (async () => {
  const form = await superValidate<PasswordResetFormSchemaThirdStep, FlashMessage>(zod(passwordResetFormSchemaThirdStep));

  return { form };
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async ({ request, cookies, locals: { db } }) => {
    const form = await superValidate<PasswordResetFormSchemaThirdStep, FlashMessage>(request, zod(passwordResetFormSchemaThirdStep));

    if (!form.valid) {
      form.data.password = "";
      form.data.passwordConfirm = "";

      logger.debug("Invalid form");

      return message(form, { status: "error", text: "Invalid form" });
    }

    // update db
    // redirect
    const status = "success";
    const text = "ok";

    redirect(route("/auth/reset-password/success"), { status, text }, cookies);
  }
};
