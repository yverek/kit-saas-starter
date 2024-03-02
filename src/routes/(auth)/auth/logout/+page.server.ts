import { route } from "$lib/ROUTES";
import type { Actions } from "./$types";
import { error, redirect } from "@sveltejs/kit";

export const actions: Actions = {
  default: async ({ locals: { lucia, session }, cookies }) => {
    if (!session) {
      // TODO check this error
      error(401);
    }

    await lucia.invalidateSession(session.id);
    const { name, value, attributes } = lucia.createBlankSessionCookie();
    cookies.set(name, value, { ...attributes, path: "/" });

    redirect(302, route("/"));
  }
} satisfies Actions;
