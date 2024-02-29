import { eq } from "drizzle-orm";
import { type Database } from "$lib/server/db";
import type { DbVerificationCode } from "./types";
import { verificationCodes } from ".";

/*
 * CREATE
 **/
export async function createNewVerificationCode(db: Database, newVerificationCode: DbVerificationCode) {
  const res = await db.insert(verificationCodes).values(newVerificationCode).onConflictDoNothing().returning();

  if (res.length === 0) return;

  return res[0];
}

/*
 * READ
 **/

/*
 * UPDATE
 **/

/*
 * DELETE
 **/
export async function deleteAllTokensByUserId(db: Database, userId: string): Promise<DbVerificationCode | undefined> {
  if (!userId) return;

  // TODO this function deletes all tokens?
  const res = await db.delete(verificationCodes).where(eq(verificationCodes.userId, userId)).returning();

  if (res.length === 0) return;

  // TODO should I return only one?
  return res[0];
}
