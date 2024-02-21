import type { Config } from "drizzle-kit";

export default {
  schema: "src/lib/server/db/schema.ts",
  out: "migrations",
  driver: "d1",
  dbCredentials: {
    wranglerConfigPath: "wrangler.toml",
    dbName: "kss-prod"
  }
} satisfies Config;
