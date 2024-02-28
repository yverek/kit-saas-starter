import { Lucia } from "lucia";
import { D1Adapter } from "@lucia-auth/adapter-sqlite";
import { dev } from "$app/environment";
import { type DbUser } from "../db/users";

export function initializeLucia(db: D1Database) {
  const adapter = new D1Adapter(db, {
    user: "users",
    session: "sessions"
  });

  return new Lucia(adapter, {
    sessionCookie: { attributes: { secure: !dev } },
    getUserAttributes: ({ id, name, email, verified }) => ({ id, name, email, verified })
  });
}

declare module "lucia" {
  export interface Register {
    Lucia: ReturnType<typeof initializeLucia>;
    DatabaseUserAttributes: Omit<DbUser, "token" | "password">;
  }
}
