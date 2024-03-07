import { route } from "$lib/ROUTES";
import type { PageServerLoad } from "./$types";
import type { Actions } from "@sveltejs/kit";
import { changeEmailFormSchemaSecondStep, type ChangeEmailFormSchemaSecondStep } from "$validations/auth";
import { superValidate, message } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import { logger } from "$lib/logger";
import { verifyChangeEmailToken } from "$lib/server/auth/auth-utils";
import { updateUserById } from "$lib/server/db/users";
import { redirect } from "sveltekit-flash-message/server";

export const load = (async ({ locals: { user } }) => {
  if (!user) redirect(302, route("/auth/login"));

  const form = await superValidate<ChangeEmailFormSchemaSecondStep, FlashMessage>(zod(changeEmailFormSchemaSecondStep));

  return { form };
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async ({ cookies, request, locals: { db, user, lucia } }) => {
    if (!user) redirect(302, route("/auth/login"));

    const form = await superValidate<ChangeEmailFormSchemaSecondStep, FlashMessage>(request, zod(changeEmailFormSchemaSecondStep));

    if (!form.valid) {
      logger.debug("Invalid form");

      return message(form, { status: "error", text: "Invalid form" });
    }

    const { token } = form.data;
    const { id: userId } = user;

    const tokenFromDatabase = await verifyChangeEmailToken(db, userId, token);
    if (!tokenFromDatabase) {
      return message(form, { status: "error", text: "Invalid token" }, { status: 500 });
    }
    const { email: newEmail } = tokenFromDatabase;
    await lucia.invalidateUserSessions(userId);

    const res = await updateUserById(db, userId, { email: newEmail });
    if (!res) {
      return message(form, { status: "error", text: "User not found" }, { status: 404 });
    }

    redirect(route("/auth/login"), { status: "success", text: "Email changed successfully. You can login now!" }, cookies);
  }
};
