import { passwordResetFormSchemaSecondStep, type PasswordResetFormSchemaSecondStep } from "$validations/auth";
import { superValidate, message } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { Actions } from "@sveltejs/kit";
import { logger } from "$lib/logger";
import { route } from "$lib/ROUTES";
import { redirect } from "sveltekit-flash-message/server";
import { verifyPasswordResetToken } from "$lib/server/lucia/auth-utils";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
  const form = await superValidate<PasswordResetFormSchemaSecondStep, FlashMessage>(zod(passwordResetFormSchemaSecondStep));

  return { form };
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async ({ params, request, cookies, locals: { db } }) => {
    const form = await superValidate<PasswordResetFormSchemaSecondStep, FlashMessage>(request, zod(passwordResetFormSchemaSecondStep));

    if (!form.valid) {
      logger.debug("Invalid form");

      return message(form, { status: "error", text: "Invalid form" });
    }

    const { token } = form.data;
    const userId = params.userId as string;

    const res = await verifyPasswordResetToken(db, userId, token);
    const status = res ? "success" : "error";
    const text = res ? "Email sent successfully" : "Error while sending your email";

    redirect(route("/auth/reset-password/[userId=userId]/new-password", { userId }), { status, text }, cookies);
  }
};
