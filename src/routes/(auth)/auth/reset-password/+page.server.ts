import { route } from "$lib/ROUTES";
import type { PageServerLoad } from "./$types";
import { redirect, type Actions } from "@sveltejs/kit";
import { superValidate, type Infer, message } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import { logger } from "$lib/logger";
import { passwordResetFormSchema } from "$validations/auth";

// TODO should we export this into its folder?
type PasswordResetFormSchemaWithoutCode = Omit<Infer<typeof passwordResetFormSchema>, "code">;

export const load = (async () => {
  const form = await superValidate(zod(passwordResetFormSchema.omit({ code: true })));

  return { form };
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async ({ request }) => {
    const form = await superValidate<PasswordResetFormSchemaWithoutCode, FlashMessage>(request, zod(passwordResetFormSchema.omit({ code: true })));

    if (!form.valid) {
      logger.debug(form, "Invalid password reset form");

      return message(form, { status: "error", text: "Invalid form" });
    }

    const { email } = form.data;

    redirect(302, route("/auth/reset-password/[email=email]", { email }));
  }
};
