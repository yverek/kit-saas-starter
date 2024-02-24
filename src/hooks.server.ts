import { drizzle } from "drizzle-orm/d1";
import { dev } from "$app/environment";

import * as schema from "$lib/server/db/schema";
import { initializeLucia } from "$lib/server/lucia";

/*
  When developing, this hook will add proxy objects to the `platform` object which
  will emulate any bindings defined in `wrangler.toml`.
*/
let platform: App.Platform;

if (dev) {
  const { getPlatformProxy } = await import("wrangler");
  platform = await getPlatformProxy();
}

export const handle = async ({ event, resolve }) => {
  if (platform) {
    event.platform = {
      ...event.platform,
      ...platform
    };
  }

  event.locals.db = drizzle(event.platform?.env.DB as D1Database, { schema });

  event.locals.lucia = initializeLucia(event.platform?.env.DB as D1Database);

  const lucia = event.locals.lucia;
  const sessionId = event.cookies.get(lucia.sessionCookieName);

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

  return resolve(event);
};
