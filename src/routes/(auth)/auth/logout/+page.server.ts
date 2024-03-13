import { route } from "$lib/ROUTES";
import { destroySession } from "$lib/server/auth/auth-utils";
import { isUserAuthenticated } from "$lib/server/security";
import type { Actions } from "./$types";
import { redirect } from "@sveltejs/kit";

export const actions: Actions = {
  default: async (event) => {
    const { locals, url, cookies } = event;

    isUserAuthenticated(locals, cookies, url);

    // ! user is defined here because of "isUserAuthenticated"
    // TODO how can we remove that "!"?
    await locals.lucia.invalidateSession(locals.session!.id);
    destroySession(locals.lucia, cookies);

    redirect(302, route("/"));
  }
} satisfies Actions;
