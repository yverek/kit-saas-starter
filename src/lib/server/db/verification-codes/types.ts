import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { verificationCodes } from ".";

export type DbVerificationCode = InferSelectModel<typeof verificationCodes>;
export type DbInsertVerificationCode = InferInsertModel<typeof verificationCodes>;
export type DbUpdateVerificationCode = Partial<DbVerificationCode>;
