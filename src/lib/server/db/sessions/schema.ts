import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { users } from "../users/schema";

export const sessions = sqliteTable("sessions", {
  id: text("id").notNull().primaryKey(), // TODO can I put a length on this field?
  expiresAt: integer("expires_at").notNull(), // TODO can I put a length on this field?
  userId: text("user_id")
    .notNull()
    .references(() => users.id)
});
