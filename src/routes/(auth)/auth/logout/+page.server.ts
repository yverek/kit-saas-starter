import { route } from "$lib/ROUTES";
import { destroySession } from "$lib/server/auth/auth-utils";
import type { Actions } from "./$types";
import { redirect } from "@sveltejs/kit";

export const actions: Actions = {
  default: async ({ locals: { lucia, session }, cookies }) => {
    if (!session) {
      redirect(302, route("/"));
    }

    await lucia.invalidateSession(session.id);
    destroySession(lucia, cookies);

    redirect(302, route("/"));
  }
} satisfies Actions;
