import { route } from "$lib/ROUTES";
import type { PageServerLoad } from "./$types";
import { redirect, type Actions } from "@sveltejs/kit";
import { emailValidationFormSchema, type EmailValidationFormSchema } from "$validations/auth";
import { superValidate, message } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import { logger } from "$lib/logger";

export const load = (async ({ locals: { user } }) => {
  if (!user) redirect(302, route("/auth/login"));
  if (user.isVerified) redirect(302, route("/dashboard"));

  const form = await superValidate<EmailValidationFormSchema, FlashMessage>(zod(emailValidationFormSchema));

  return { form };
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async ({ request }) => {
    const form = await superValidate<EmailValidationFormSchema, FlashMessage>(request, zod(emailValidationFormSchema));

    if (!form.valid) {
      logger.debug(form, "Invalid email verification form");

      return message(form, { status: "error", text: "Invalid form" });
    }

    const { token } = form.data;

    redirect(302, route("/auth/verify-email/token=[token=token]", { token }));
  }
};
