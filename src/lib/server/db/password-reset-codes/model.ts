import { eq } from "drizzle-orm";
import { type Database } from "$lib/server/db";
import type { DbPasswordResetCode } from "./types";
import { passwordResetCodes } from ".";

/*
 * CREATE
 **/
export async function createNewPasswordResetCode(db: Database, newPasswordResetCode: DbPasswordResetCode) {
  const res = await db.insert(passwordResetCodes).values(newPasswordResetCode).onConflictDoNothing().returning();

  if (res.length === 0) return;

  return res[0];
}

/*
 * READ
 **/
export async function getPasswordResetCodeByUserId(db: Database, userId: string): Promise<DbPasswordResetCode | undefined> {
  if (!userId) return;

  return await db.query.passwordResetCodes.findFirst({ where: eq(passwordResetCodes.userId, userId) });
}

/*
 * UPDATE
 **/

/*
 * DELETE
 **/
export async function deleteAllPasswordResetCodesByUserId(db: Database, userId: string): Promise<DbPasswordResetCode | undefined> {
  if (!userId) return;

  // TODO this function deletes all codes?
  const res = await db.delete(passwordResetCodes).where(eq(passwordResetCodes.userId, userId)).returning();

  if (res.length === 0) return;

  // TODO should I return only one?
  return res[0];
}

export async function deletePasswordResetCodeByCode(db: Database, code: string): Promise<DbPasswordResetCode | undefined> {
  if (!code) return;

  const res = await db.delete(passwordResetCodes).where(eq(passwordResetCodes.code, code)).returning();

  if (res.length === 0) return;

  return res[0];
}
