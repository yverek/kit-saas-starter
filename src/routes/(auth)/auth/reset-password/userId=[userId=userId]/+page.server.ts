import { passwordResetFormSchemaSecondStep, type PasswordResetFormSchemaSecondStep } from "$validations/auth";
import { superValidate, message } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { Actions } from "@sveltejs/kit";
import { logger } from "$lib/logger";
import { route } from "$lib/ROUTES";
import { redirect } from "sveltekit-flash-message/server";
import { verifyPasswordResetToken } from "$lib/server/lucia/auth-utils";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params }) => {
  const { userId } = params;

  const form = await superValidate(zod(passwordResetFormSchemaSecondStep));
  form.data.userId = userId;

  return { form };
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async ({ request, cookies, locals: { db } }) => {
    const form = await superValidate<PasswordResetFormSchemaSecondStep, FlashMessage>(request, zod(passwordResetFormSchemaSecondStep));

    if (!form.valid) {
      logger.debug(form, "Invalid code for password reset form");

      return message(form, { status: "error", text: "Invalid form" });
    }

    const { token, userId } = form.data;

    const res = await verifyPasswordResetToken(db, userId, token);
    const status = res ? "success" : "error";
    const text = res ? "Email sent successfully" : "Error while sending your email";

    redirect(route("/auth/reset-password/token=[token=token]", { token }), { status, text }, cookies);
  }
};
