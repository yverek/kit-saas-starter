import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { users } from "../users/schema";

export const sessions = sqliteTable("sessions", {
  id: text("id").notNull().primaryKey(),
  expiresAt: integer("expires_at").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id)
});
