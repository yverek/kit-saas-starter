import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { emailVerificationTokens } from ".";

export type DbEmailVerificationToken = InferSelectModel<typeof emailVerificationTokens>;
export type DbInsertEmailVerificationToken = InferInsertModel<typeof emailVerificationTokens>;
export type DbUpdateEmailVerificationToken = Partial<DbEmailVerificationToken>;
