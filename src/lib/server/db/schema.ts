import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").notNull().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  token: text("token").notNull().unique(),
  isVerified: integer("is_verified").notNull().default(0),
  isAdmin: integer("is_admin").notNull().default(0)
});

export const sessions = sqliteTable("sessions", {
  id: text("id").notNull().primaryKey(),
  expiresAt: integer("expires_at").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id)
});
