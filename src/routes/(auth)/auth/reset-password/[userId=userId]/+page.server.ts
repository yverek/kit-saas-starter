import { resetPasswordFormSchemaSecondStep, type ResetPasswordFormSchemaSecondStep } from "$validations/auth";
import { superValidate, message } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { Actions } from "@sveltejs/kit";
import { logger } from "$lib/logger";
import { route } from "$lib/ROUTES";
import { redirect } from "sveltekit-flash-message/server";
import type { PageServerLoad } from "./$types";
import { verifyToken } from "$lib/server/auth/auth-utils";
import { TOKEN_TYPE } from "$lib/server/db/tokens";

export const load = (async () => {
  const form = await superValidate<ResetPasswordFormSchemaSecondStep, FlashMessage>(zod(resetPasswordFormSchemaSecondStep));

  return { form };
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async ({ params, request, cookies, locals: { db } }) => {
    const form = await superValidate<ResetPasswordFormSchemaSecondStep, FlashMessage>(request, zod(resetPasswordFormSchemaSecondStep));

    if (!form.valid) {
      logger.debug("Invalid form");

      return message(form, { status: "error", text: "Invalid form" });
    }

    const { token } = form.data;
    const userId = params.userId as string;

    const isValidToken = await verifyToken(db, userId, token, TOKEN_TYPE.PASSWORD_RESET);
    if (!isValidToken) {
      logger.debug("Invalid token");

      return message(form, { status: "error", text: "Invalid token" });
    }

    redirect(
      route("/auth/reset-password/[userId=userId]/new-password", { userId }),
      { status: "success", text: "You can change your password" },
      cookies
    );
  }
};
