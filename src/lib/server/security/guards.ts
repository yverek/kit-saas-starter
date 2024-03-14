import { FLASH_MESSAGE_STATUS } from "$configs/general";
import { route } from "$lib/ROUTES";
import { error, type Cookies } from "@sveltejs/kit";
import { redirect } from "sveltekit-flash-message/server";

/**
 * Checks if the user is anonymous.
 * Redirects them to the dashboard if they are not.
 *
 * @param locals - The locals object.
 * @returns void
 */
export function isAnonymous(locals: App.Locals) {
  if (locals.user && locals.session) redirect(303, route("/app/dashboard"));
}

/**
 * Checks if the user is authenticated.
 * Redirects them to the login page if they are not.
 *
 * @param url - The URL object.
 * @param locals - The locals object of RequestEvent.
 * @param cookies - The cookies object of RequestEvent.
 * @returns void
 */
export function isUserAuthenticated(locals: App.Locals, cookies: Cookies, url: URL) {
  if (!locals.user && !locals.session) {
    const redirectTo = url.pathname;
    const flashMessage = { status: FLASH_MESSAGE_STATUS.SUCCESS, text: "Please login first" };

    redirect(route("/auth/login", { redirectTo }), flashMessage, cookies);
  }
}

/**
 * Checks if the user is authenticated and is not verified.
 * Redirects them to the dashboard if they are not.
 *
 * @param url - The URL object.
 * @param locals - The locals object of RequestEvent.
 * @param cookies - The cookies object of RequestEvent.
 * @returns void
 */
export function isUserNotVerified(locals: App.Locals, cookies: Cookies, url: URL) {
  isUserAuthenticated(locals, cookies, url);

  if (locals.user?.isVerified) {
    const flashMessage = { status: FLASH_MESSAGE_STATUS.SUCCESS, text: "Your account is already verified" };

    redirect(route("/app/dashboard"), flashMessage, cookies);
  }
}

/**
 * Checks if the user is authenticated and has admin privileges.
 * Redirects them to the dashboard if they are not.
 *
 * @param url - The URL object.
 * @param locals - The locals object of RequestEvent.
 * @param cookies - The cookies object of RequestEvent.
 * @returns void
 */
export function isUserAdmin(locals: App.Locals, cookies: Cookies, url: URL) {
  isUserAuthenticated(locals, cookies, url);

  if (!locals.user?.isAdmin) error(404);
}
