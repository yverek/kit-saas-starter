import { getUserByToken } from "$lib/server/db/user";
import { error, fail } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params, locals: { db } }) => {
  let title = "Email verification error";
  let message = "Your email could not be verified. Please contact support if you feel this is an error.";

  const token = params.token;
  const user = ""; //await getUserByToken(db, token);

  if (user) {
    // sendWelcomeEmail(user.email);
    title = "Email verified";
    message = "Your email has been verified!";
    // await updateUser(user.id, { verified: true });
  }

  return { title, message };
}) satisfies PageServerLoad;
