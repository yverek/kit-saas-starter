import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";
import { users } from "../schema";
import { OAUTH_PROVIDERS } from "$configs/general";

export const oauthAccounts = sqliteTable(
  "oauth_accounts",
  {
    providerId: text("provider_id", { enum: [OAUTH_PROVIDERS.GITHUB, OAUTH_PROVIDERS.GOOGLE] }).notNull(),
    providerUserId: text("provider_user_id").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .$default(() => new Date()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" })
  },
  (t) => ({ pk: primaryKey({ columns: [t.providerId, t.providerUserId] }) })
);
