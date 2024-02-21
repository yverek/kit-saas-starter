import { drizzle } from "drizzle-orm/d1";
import { dev } from "$app/environment";

import * as schema from "$lib/server/db/schema";

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

  const test = await event.locals.db.query.users.findFirst();
  console.log("🚀 ~ test:", test);

  return resolve(event);
};
