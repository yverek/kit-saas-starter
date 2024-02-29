import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { users } from "../schema";
// import { VERIFICATION_CODE_LEN } from "$configs/fields-length";

export const verificationCodes = sqliteTable("verification_codes", {
  code: text("code", { length: 15 }).primaryKey(), // TODO can I export this into a constant?
  email: text("email").notNull().unique(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id)
});
