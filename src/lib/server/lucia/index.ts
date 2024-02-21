import { Lucia } from "lucia";
import { D1Adapter } from "@lucia-auth/adapter-sqlite";
import { dev } from "$app/environment";

export function initializeLucia(db: D1Database) {
  const adapter = new D1Adapter(db, {
    user: "users",
    session: "sessions"
  });

  return new Lucia(adapter, {
    sessionCookie: { attributes: { secure: !dev } },
    getUserAttributes: ({ name, email }) => ({ name, email })
  });
}

declare module "lucia" {
  export interface Register {
    exportAuth: ReturnType<typeof initializeLucia>;
    DatabaseUserAttributes: { name: string; email: string };
  }
}
