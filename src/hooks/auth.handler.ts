import { logger } from "$lib/logger";
import type { Handle } from "@sveltejs/kit";

import { initializeLucia } from "$lib/server/lucia";

export const auth: Handle = async ({ event, resolve }) => {
  event.locals.lucia = initializeLucia(event.platform?.env.DB as D1Database);

  const lucia = event.locals.lucia;
  const sessionId = event.cookies.get(lucia.sessionCookieName);

  logger.debug(`Session ID: ${sessionId}`);

  if (!sessionId) {
    event.locals.user = null;
    event.locals.session = null;
    return resolve(event);
  }

  const { session, user } = await lucia.validateSession(sessionId);

  if (session && session.fresh) {
    const { name, value, attributes } = lucia.createSessionCookie(session.id);

    event.cookies.set(name, value, { ...attributes, path: "/" });
  }

  if (!session) {
    const { name, value, attributes } = lucia.createBlankSessionCookie();

    event.cookies.set(name, value, { ...attributes, path: "/" });
  }

  event.locals.user = user;
  event.locals.session = session;

  logger.debug(`User: ${JSON.stringify(user)}`);
  logger.debug(`Session: ${JSON.stringify(session)}`);

  return resolve(event);
};
