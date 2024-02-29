import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").notNull().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  isVerified: integer("is_verified", { mode: "boolean" }).notNull().default(false),
  isAdmin: integer("is_admin", { mode: "boolean" }).notNull().default(false)
});
