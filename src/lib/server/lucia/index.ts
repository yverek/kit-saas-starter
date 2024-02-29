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
    getUserAttributes: (data) => {
      return { id: data.id, name: data.name, email: data.email, isVerified: data.is_verified, isAdmin: data.is_admin };
    }
  });
}

// TODO this is an hardcoded interface, can we retrieve it from drizzle?
interface DatabaseUserAttributes {
  id: string;
  name: string;
  email: string;
  password: string;
  is_verified: boolean;
  is_admin: boolean;
}

declare module "lucia" {
  export interface Register {
    Lucia: ReturnType<typeof initializeLucia>;
    Auth: ReturnType<typeof initializeLucia>;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}
