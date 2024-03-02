import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { passwordResetTokens } from ".";

export type DbPasswordResetToken = InferSelectModel<typeof passwordResetTokens>;
export type DbInsertPasswordResetToken = InferInsertModel<typeof passwordResetTokens>;
export type DbUpdatePasswordResetToken = Partial<DbPasswordResetToken>;
