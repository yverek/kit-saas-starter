import type { Lucia } from "lucia";

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface PageState {}
    interface PageData {
      flash?: FlashMessage;
    }
    interface Locals {
      db: Database;
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
