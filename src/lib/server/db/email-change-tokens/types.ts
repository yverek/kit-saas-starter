import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { emailChangeTokens } from ".";

export type DbEmailChangeToken = InferSelectModel<typeof emailChangeTokens>;
export type DbInsertEmailChangeToken = InferInsertModel<typeof emailChangeTokens>;
export type DbUpdateEmailChangeToken = Partial<DbEmailChangeToken>;
