import { route } from "$lib/ROUTES";
import { redirect } from "sveltekit-flash-message/server";

export function isAnonymous(locals: App.Locals) {
  if (locals.user && locals.session) redirect(303, route("/dashboard"));
}

export function isUserAuthenticated(locals: App.Locals) {
  if (!locals.user && !locals.session) redirect(303, route("/auth/login"));
}

export function isUserNotVerified(locals: App.Locals) {
  isUserAuthenticated(locals);

  if (locals.user?.isVerified) redirect(303, route("/dashboard"));
}

export function isUserAdmin(locals: App.Locals) {
  isUserAuthenticated(locals);

  if (!locals.user?.isAdmin) redirect(303, route("/auth/login"));
}
