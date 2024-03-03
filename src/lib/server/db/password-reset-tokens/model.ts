import { eq } from "drizzle-orm";
import { type Database } from "$lib/server/db";
import type { DbInsertPasswordResetToken, DbPasswordResetToken } from "./types";
import { passwordResetTokens } from ".";

/*
 * CREATE
 **/
export async function createPasswordResetToken(db: Database, newPasswordResetToken: DbInsertPasswordResetToken) {
  const res = await db.insert(passwordResetTokens).values(newPasswordResetToken).onConflictDoNothing().returning();

  if (res.length === 0) return;

  return res[0];
}

/*
 * READ
 **/
export async function getPasswordResetToken(db: Database, token: string): Promise<DbPasswordResetToken | undefined> {
  if (!token) return;

  return await db.query.passwordResetTokens.findFirst({ where: eq(passwordResetTokens.token, token) });
}

export async function getPasswordResetTokenByUserId(db: Database, userId: string): Promise<DbPasswordResetToken | undefined> {
  if (!userId) return;

  return await db.query.passwordResetTokens.findFirst({ where: eq(passwordResetTokens.userId, userId) });
}

/*
 * UPDATE
 **/

/*
 * DELETE
 **/
export async function deleteAllPasswordResetTokensByUserId(db: Database, userId: string): Promise<DbPasswordResetToken[] | undefined> {
  if (!userId) return;

  const res = await db.delete(passwordResetTokens).where(eq(passwordResetTokens.userId, userId)).returning();

  if (res.length === 0) return;

  return res;
}

export async function deletePasswordResetToken(db: Database, token: string): Promise<DbPasswordResetToken | undefined> {
  if (!token) return;

  const res = await db.delete(passwordResetTokens).where(eq(passwordResetTokens.token, token)).returning();

  if (res.length === 0) return;

  return res[0];
}
