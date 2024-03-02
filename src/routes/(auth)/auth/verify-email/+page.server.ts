import { route } from "$lib/ROUTES";
import type { PageServerLoad } from "./$types";
import { redirect, type Actions } from "@sveltejs/kit";
import { emailValidationFormSchema } from "$validations/auth";
import { superValidate, type Infer, message } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import { logger } from "$lib/logger";

export const load = (async ({ locals: { user } }) => {
  if (!user) redirect(302, route("/auth/login"));
  if (user.isVerified) redirect(302, route("/dashboard"));

  const form = await superValidate(zod(emailValidationFormSchema));

  return { form };
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async ({ request }) => {
    const form = await superValidate<Infer<typeof emailValidationFormSchema>, FlashMessage>(request, zod(emailValidationFormSchema));

    if (!form.valid) {
      logger.debug(form, "Invalid email verification form");

      return message(form, { status: "error", text: "Invalid form" });
    }

    const { code } = form.data;

    redirect(302, route("/auth/verify-email/[code=code]", { code }));
  }
};
