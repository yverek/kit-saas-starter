import DrizzleD1Database from "drizzle-orm/d1";
import * as schema from "$lib/server/db/schema";
import type { Lucia } from "lucia";

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface PageState {}
    interface PageData {
      flashMessage?: FlashMessage;
    }
    interface Locals {
      db: DrizzleD1Database<typeof schema>;
      lucia: Lucia;
      user: import("lucia").User | null;
      session: import("lucia").Session | null;
    }
    interface Platform {
      env: Env;
      cf: CfProperties;
      ctx: ExecutionContext;
    }
  }
  namespace Superforms {
    type Message = FlashMessage;
  }
}

export {};
