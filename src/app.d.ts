import DrizzleD1Database from "drizzle-orm/d1";
import * as schema from "$lib/server/db/schema";

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface PageData {}
    // interface PageState {}
    interface Locals {
      db: DrizzleD1Database<typeof schema>;
    }
    interface Platform {
      env: Env;
      cf: CfProperties;
      ctx: ExecutionContext;
    }
  }
}

export {};
