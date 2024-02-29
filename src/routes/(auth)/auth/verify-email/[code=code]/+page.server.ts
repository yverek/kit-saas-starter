import { updateUserById } from "$lib/server/db/users";
import { sendWelcomeEmail } from "$lib/server/email/send";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { route } from "$lib/ROUTES";
import { verifyVerificationCode } from "$lib/server/lucia/auth-utils";

export const load = (async ({ cookies, params, locals: { db, lucia, user } }) => {
  if (!user) redirect(302, route("/auth/login"));
  if (user.isVerified) redirect(302, route("/dashboard"));

  const { code } = params;

  let title = "Email verification error";
  let message = "Your email could not be verified. Please contact support if you feel this is an error.";

  const { id, email } = user;
  const isValidCode = await verifyVerificationCode(db, id, email, code);
  if (!isValidCode) {
    return { title, message };
  }

  await lucia.invalidateUserSessions(user.id);

  const res = await updateUserById(db, user.id, { isVerified: true });
  if (res) {
    const session = await lucia.createSession(user.id, {});
    if (session) {
      const { name, value, attributes } = lucia.createSessionCookie(session.id);

      cookies.set(name, value, { ...attributes, path: "/" });
    }

    const { email, name } = user;
    await sendWelcomeEmail(email, name);

    title = "Email verified";
    message = "Your email has been verified!";
  }

  return { title, message };
}) satisfies PageServerLoad;
