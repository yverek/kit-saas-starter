import * as schema from "$lib/server/db/schema";
import type { DrizzleD1Database } from "drizzle-orm/d1";

export type Database = DrizzleD1Database<typeof schema>;
