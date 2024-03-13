import { FLASH_MESSAGE_STATUS } from "$configs/general";
import { route } from "$lib/ROUTES";
import { logger } from "$lib/logger";
import { error, type Handle } from "@sveltejs/kit";
import { redirect } from "sveltekit-flash-message/server";

export const authorization: Handle = async ({ event, resolve }) => {
  const {
    locals,
    route: { id }
  } = event;

  logger.debug(`ROUTE: ${id}`);

  const isAuthenticated = !!locals.user;
  const isVerified = !!locals.user?.isVerified;
  const isAdmin = !!locals.user?.isAdmin;
  const isAdminRoute = !!id?.startsWith("/(admin)");
  const isUserRoute = !!id?.startsWith("/(app)");
  const isProtectedRoute = isUserRoute || isAdminRoute;

  // if user is trying to access a protected route and it's not verified
  if (isProtectedRoute && isAuthenticated && !isVerified) {
    logger.debug(`Redirect to ${route("/auth/verify-email")} route because user is not verified`);

    redirect(303, route("/auth/verify-email"));
  }

  // if user is trying to access admin protected route and it's not an admin
  if (isAdminRoute && isAuthenticated && !isAdmin) {
    logger.debug(`Throwing 404 because someone is trying to access admin section and it is not admin`);

    error(404);
  }

  // if user is trying to access an user protected route and it's not authenticated
  if (isUserRoute && !isAuthenticated) {
    const redirectTo = event.url.pathname;
    const flashMessage = { status: FLASH_MESSAGE_STATUS.SUCCESS, text: "Please login first" };

    logger.debug(`Redirect to ${route("/auth/login", { redirectTo })} route because user is not authenticated`);

    redirect(route("/auth/login", { redirectTo }), flashMessage, event.cookies);
  }

  return resolve(event);
};
