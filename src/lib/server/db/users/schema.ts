import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { USER_ID_LEN } from "../../../configs/fields-length";
import type { OAUTH_PROVIDERS } from "$configs/general";

export const users = sqliteTable("users", {
  id: text("id", { length: USER_ID_LEN }).notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  password: text("password"),
  authMethods: text("auth_methods", { mode: "json" }).$type<OAUTH_PROVIDERS[]>().notNull(),
  avatarUrl: text("avatar_url"),
  isVerified: integer("is_verified", { mode: "boolean" }).notNull().default(false),
  isAdmin: integer("is_admin", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$default(() => new Date()),
  modifiedAt: integer("modified_at", { mode: "timestamp_ms" })
});
