import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { users } from "../schema";
import { VERIFICATION_CODE_LEN } from "$configs/fields-length";

export const verificationCodes = sqliteTable("users", {
  id: integer("id", { mode: "number" }).notNull().primaryKey({ autoIncrement: true }),
  code: text("code", { length: VERIFICATION_CODE_LEN }).notNull().unique(),
  email: text("email").notNull().unique(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id)
});
