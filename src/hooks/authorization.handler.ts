import { logger } from "$lib/logger";
import type { Handle } from "@sveltejs/kit";

export const authorization: Handle = async ({ event, resolve }) => {
  const { locals, route } = event;
  logger.debug(route, "🚀 ~ route:");
  logger.debug(locals.user, "🚀 ~ user:");
  logger.debug(locals.session, "🚀 ~ session:");

  // if (locals.user?.) console.l
  // console.log("🚀 ~ event:", event);

  // event.locals.user = user;
  // event.locals.session = session;

  // logger.debug(user, "User");
  // logger.debug(session, "Session");

  return resolve(event);
};
