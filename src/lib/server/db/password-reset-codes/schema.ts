import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { users } from "../schema";
import { PASSWORD_RESET_CODE_LEN } from "../../../configs/fields-length";

export const passwordResetCodes = sqliteTable("password_reset_codes", {
  code: text("code", { length: PASSWORD_RESET_CODE_LEN }).primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id)
});
