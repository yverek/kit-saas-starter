import { route } from "$lib/ROUTES";
import type { PageServerLoad } from "./$types";
import type { Actions } from "@sveltejs/kit";
import { superValidate, message } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import { logger } from "$lib/logger";
import { passwordResetFormSchema, type PasswordResetFormSchemaWithoutCodeField } from "$validations/auth";
import { generatePasswordResetCode } from "$lib/server/lucia/auth-utils";
import { getUserByEmail } from "$lib/server/db/users";
import { sendPasswordResetEmail } from "$lib/server/email/send";
import { redirect } from "sveltekit-flash-message/server";

export const load = (async () => {
  const form = await superValidate(zod(passwordResetFormSchema.omit({ code: true })));

  return { form };
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async ({ cookies, request, locals: { db } }) => {
    const form = await superValidate<PasswordResetFormSchemaWithoutCodeField, FlashMessage>(
      request,
      zod(passwordResetFormSchema.omit({ code: true }))
    );

    if (!form.valid) {
      logger.debug(form, "Invalid email for password reset form");

      return message(form, { status: "error", text: "Invalid form" });
    }

    const { email } = form.data;

    const user = await getUserByEmail(db, email);
    if (!user) {
      return message(form, { status: "error", text: "User not found" }, { status: 404 });
    }

    const code = await generatePasswordResetCode(db, user.id);
    if (!code) {
      return message(form, { status: "error", text: "Failed to generate password reset code" }, { status: 500 });
    }

    const mail = await sendPasswordResetEmail(email, code);
    if (!mail) {
      return message(form, { status: "error", text: "Failed to send password reset mail" }, { status: 500 });
    }

    // TODO fix this, can't see toast message
    redirect(route("/auth/reset-password/[email=email]", { email }), { status: "success", text: "Email send successfully" }, cookies);
  }
};
