import { getUserByToken, updateUserById } from "$lib/server/db/users";
import { sendWelcomeEmail } from "$lib/server/email/send";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { route } from "$lib/ROUTES";

export const load = (async ({ params, locals: { db } }) => {
  let title = "Email verification error";
  let message = "Your email could not be verified. Please contact support if you feel this is an error.";

  const token = params.token;
  const user = await getUserByToken(db, token);

  if (user) {
    if (user.isVerified) redirect(302, route("/dashboard"));
    const res = await updateUserById(db, user.id, { isVerified: 1 });

    if (res) {
      const { email, name } = user;
      await sendWelcomeEmail(email, name);
      title = "Email verified";
      message = "Your email has been verified!";
    }
  }

  return { title, message };
}) satisfies PageServerLoad;
