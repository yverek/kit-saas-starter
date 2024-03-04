import { route } from "$lib/ROUTES";
import type { PageServerLoad } from "./$types";
import type { Actions } from "@sveltejs/kit";
import { changeEmailFormSchemaFirstStep, type ChangeEmailFormSchemaFirstStep } from "$validations/auth";
import { superValidate, message } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import { logger } from "$lib/logger";
import { generateChangeEmailToken } from "$lib/server/lucia/auth-utils";
import type { DbUser } from "$lib/server/db/users";
import { sendEmailChangeEmail } from "$lib/server/email/send";
import { redirect } from "sveltekit-flash-message/server";

export const load = (async ({ locals: { user } }) => {
  if (!user) redirect(302, route("/auth/login"));

  const form = await superValidate<ChangeEmailFormSchemaFirstStep, FlashMessage>(zod(changeEmailFormSchemaFirstStep));

  return { form };
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async ({ cookies, request, locals: { db, user } }) => {
    const form = await superValidate<ChangeEmailFormSchemaFirstStep, FlashMessage>(request, zod(changeEmailFormSchemaFirstStep));

    if (!form.valid) {
      logger.debug("Invalid form");

      return message(form, { status: "error", text: "Invalid form" });
    }

    const { email } = form.data;
    const { id: userId, name } = user as DbUser;

    const token = await generateChangeEmailToken(db, userId, email);
    if (!token) {
      return message(form, { status: "error", text: "Failed to generate change email token" }, { status: 500 });
    }

    const mail = await sendEmailChangeEmail(email, name, token);
    if (!mail) {
      return message(form, { status: "error", text: "Failed to send email change mail" }, { status: 500 });
    }

    // TODO fix this, can't see toast message
    redirect(route("/auth/change-email/confirm"), { status: "success", text: "Email sent successfully" }, cookies);
  }
};
