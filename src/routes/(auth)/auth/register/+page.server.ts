import type { PageServerLoad, Actions } from "./$types";
import { generateId } from "lucia";
import { users } from "$lib/server/db/schema";
import { createPasswordHash } from "$lib/server/lucia/auth-utils";
import registerFormSchema from "$lib/zod-schemas/register-form.schema";
import { superValidate, message, type Infer } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import { sendWelcomeEmail } from "$lib/server/email/send";
import { redirect } from "sveltekit-flash-message/server";

export const load: PageServerLoad = async ({ locals, cookies }) => {
  if (locals.user) redirect("/dashboard", { status: "success", text: "You are already logged in." }, cookies);

  const form = await superValidate(zod(registerFormSchema));

  return { form };
};

export const actions: Actions = {
  default: async ({ request, cookies, locals: { lucia, db } }) => {
    const form = await superValidate<Infer<typeof registerFormSchema>, FlashMessage>(request, zod(registerFormSchema));

    if (!form.valid) {
      form.data.password = "";
      form.data.passwordConfirm = "";

      return message(form, { status: "error", text: "Invalid form" });
    }

    const { name, email, password } = form.data;

    const hashedPassword = await createPasswordHash(password);
    const userId = generateId(15);

    try {
      await db.insert(users).values({ id: userId, name, email, password: hashedPassword });

      const res = await sendWelcomeEmail(email);

      if (!res.success) {
        // TODO we need to log this using a library
        console.error(res.error);
      }

      const session = await lucia.createSession(userId, {});
      if (session) {
        const { name, value, attributes } = lucia.createSessionCookie(session.id);
        cookies.set(name, value, { ...attributes, path: "/" });
      }
    } catch (e) {
      if (e instanceof Error && e.message === `D1_ERROR: UNIQUE constraint failed: users.email`) {
        return message(form, { status: "error", text: "Email already used" }, { status: 400 });
      }

      return message(form, { status: "error", text: "An unknown error occurred" }, { status: 500 });
    }

    redirect(302, "/");
  }
};
