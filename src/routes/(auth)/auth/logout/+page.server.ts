import { route } from "$lib/ROUTES";
import { destroySession } from "$lib/server/auth/auth-utils";
import type { Actions } from "./$types";
import { error, redirect } from "@sveltejs/kit";

export const actions: Actions = {
  default: async ({ locals: { lucia, session }, cookies }) => {
    if (!session) {
      // TODO check this error
      error(401);
    }

    await lucia.invalidateSession(session.id);
    destroySession(lucia, cookies);

    redirect(302, route("/"));
  }
} satisfies Actions;
