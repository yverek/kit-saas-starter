import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { users } from "../schema";
import { TOKEN_LEN } from "../../../configs/fields-length";

export const emailVerificationTokens = sqliteTable("email_verification_tokens", {
  token: text("token", { length: TOKEN_LEN }).primaryKey(),
  email: text("email").notNull().unique(), // TODO delete this field
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id)
});
