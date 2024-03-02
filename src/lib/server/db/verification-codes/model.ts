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
export async function getVerificationCodeByUserId(db: Database, userId: string): Promise<DbVerificationCode | undefined> {
  if (!userId) return;

  return await db.query.verificationCodes.findFirst({ where: eq(verificationCodes.userId, userId) });
}

/*
 * UPDATE
 **/

/*
 * DELETE
 **/
export async function deleteAllVerificationCodesByUserId(db: Database, userId: string): Promise<DbVerificationCode | undefined> {
  if (!userId) return;

  // TODO this function deletes all codes?
  const res = await db.delete(verificationCodes).where(eq(verificationCodes.userId, userId)).returning();

  if (res.length === 0) return;

  // TODO should I return only one?
  return res[0];
}

export async function deleteVerificationCodeByCode(db: Database, code: string): Promise<DbVerificationCode | undefined> {
  if (!code) return;

  const res = await db.delete(verificationCodes).where(eq(verificationCodes.code, code)).returning();

  if (res.length === 0) return;

  return res[0];
}
