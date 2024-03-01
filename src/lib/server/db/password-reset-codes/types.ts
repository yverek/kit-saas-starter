import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { passwordResetCodes } from ".";

export type DbPasswordResetCode = InferSelectModel<typeof passwordResetCodes>;
export type DbInsertPasswordResetCode = InferInsertModel<typeof passwordResetCodes>;
export type DbUpdatePasswordResetCode = Partial<DbPasswordResetCode>;
