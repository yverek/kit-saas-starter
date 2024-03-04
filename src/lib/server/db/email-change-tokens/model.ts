import { eq } from "drizzle-orm";
import { type Database } from "$lib/server/db";
import type { DbInsertEmailChangeToken, DbEmailChangeToken } from "./types";
import { emailChangeTokens } from ".";

/*
 * CREATE
 **/
export async function createEmailChangeToken(db: Database, newEmailChangeToken: DbInsertEmailChangeToken) {
  const res = await db.insert(emailChangeTokens).values(newEmailChangeToken).onConflictDoNothing().returning();

  if (res.length === 0) return;

  return res[0];
}

/*
 * READ
 **/
export async function getEmailChangeToken(db: Database, token: string): Promise<DbEmailChangeToken | undefined> {
  if (!token) return;

  return await db.query.emailChangeTokens.findFirst({ where: eq(emailChangeTokens.token, token) });
}

export async function getEmailChangeTokenByUserId(db: Database, userId: string): Promise<DbEmailChangeToken | undefined> {
  if (!userId) return;

  return await db.query.emailChangeTokens.findFirst({ where: eq(emailChangeTokens.userId, userId) });
}

/*
 * UPDATE
 **/

/*
 * DELETE
 **/
export async function deleteAllEmailChangeTokensByUserId(db: Database, userId: string): Promise<DbEmailChangeToken[] | undefined> {
  if (!userId) return;

  const res = await db.delete(emailChangeTokens).where(eq(emailChangeTokens.userId, userId)).returning();

  if (res.length === 0) return;

  return res;
}

export async function deleteEmailChangeToken(db: Database, token: string): Promise<DbEmailChangeToken | undefined> {
  if (!token) return;

  const res = await db.delete(emailChangeTokens).where(eq(emailChangeTokens.token, token)).returning();

  if (res.length === 0) return;

  return res[0];
}
