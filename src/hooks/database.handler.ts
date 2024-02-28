import { dev } from "$app/environment";
import { logger } from "$lib/logger";
import type { Handle } from "@sveltejs/kit";
import { drizzle } from "drizzle-orm/d1";

import { schema } from "$lib/server/db";

/*
 * When developing, this hook will add proxy objects to the `platform` object which
 * will emulate any bindings defined in `wrangler.toml`.
 **/
let platform: App.Platform;

if (dev) {
  logger.debug("Dev mode: populating platform env var");
  const { getPlatformProxy } = await import("wrangler");
  platform = await getPlatformProxy();
}

export const database: Handle = async ({ event, resolve }) => {
  if (platform) {
    event.platform = {
      ...event.platform,
      ...platform
    };
  }

  event.locals.db = drizzle(event.platform?.env.DB as D1Database, { schema });

  return resolve(event);
};
