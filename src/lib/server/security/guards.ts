import { route } from "$lib/ROUTES";
import { redirect } from "sveltekit-flash-message/server";

/**
 * Checks if the user is anonymous.
 * Redirects them to the dashboard if they are not.
 *
 * @param locals - The locals object.
 * @returns void
 */
export function isAnonymous(locals: App.Locals) {
  if (locals.user && locals.session) redirect(303, route("/dashboard"));
}

/**
 * Checks if the user is authenticated.
 * Redirects them to the login page if they are not.
 *
 * @param locals - The locals object.
 * @returns void
 */
export function isUserAuthenticated(locals: App.Locals) {
  if (!locals.user && !locals.session) redirect(303, route("/auth/login"));
}

/**
 * Checks if the user is authenticated and is not verified.
 * Redirects them to the dashboard if they are not.
 *
 * @param locals - The locals object.
 * @returns void
 */
export function isUserNotVerified(locals: App.Locals) {
  isUserAuthenticated(locals);

  if (locals.user?.isVerified) redirect(303, route("/dashboard"));
}

/**
 * Checks if the user is authenticated and has admin privileges.
 * Redirects them to the dashboard if they are not.
 *
 * @param locals - The locals object.
 * @returns void
 */
export function isUserAdmin(locals: App.Locals) {
  isUserAuthenticated(locals);

  if (!locals.user?.isAdmin) redirect(303, route("/dashboard"));
}
