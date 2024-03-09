import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { users } from "../schema";
import { TOKEN_LEN } from "../../../configs/fields-length";

export const tokens = sqliteTable("tokens", {
  token: text("token", { length: TOKEN_LEN }).primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
});
