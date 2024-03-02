import { route } from "$lib/ROUTES";
import { logger } from "$lib/logger";
import { redirect, type Handle } from "@sveltejs/kit";

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
  if (isProtectedRoute && !isVerified) {
    logger.debug(`Redirect to ${route("/auth/verify-email")} route because user is not verified`);

    redirect(302, route("/auth/verify-email"));
  }

  // if user is trying to access admin protected route and it's not an admin
  if (isAdminRoute && !isAdmin) {
    logger.debug(`Redirect to ${route("/")} route because user is not admin`);

    redirect(302, route("/"));
  }

  // if user is trying to access an user protected route and it's not authenticated
  if (isUserRoute && !isAuthenticated) {
    logger.debug(`Redirect to ${route("/")} route because user is not authenticated`);

    redirect(302, route("/"));
  }

  return resolve(event);
};
