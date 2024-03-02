import { eq } from "drizzle-orm";
import { type Database } from "$lib/server/db";
import type { DbEmailVerificationToken } from "./types";
import { emailVerificationTokens } from ".";

/*
 * CREATE
 **/
export async function createEmailVerificationToken(db: Database, newEmailVerificationToken: DbEmailVerificationToken) {
  const res = await db.insert(emailVerificationTokens).values(newEmailVerificationToken).onConflictDoNothing().returning();

  if (res.length === 0) return;

  return res[0];
}

/*
 * READ
 **/
export async function getEmailVerificationTokenByUserId(db: Database, userId: string): Promise<DbEmailVerificationToken | undefined> {
  if (!userId) return;

  return await db.query.emailVerificationTokens.findFirst({ where: eq(emailVerificationTokens.userId, userId) });
}

/*
 * UPDATE
 **/

/*
 * DELETE
 **/
export async function deleteAllEmailVerificationTokensByUserId(db: Database, userId: string): Promise<DbEmailVerificationToken | undefined> {
  if (!userId) return;

  // TODO this function deletes all tokens?
  const res = await db.delete(emailVerificationTokens).where(eq(emailVerificationTokens.userId, userId)).returning();

  if (res.length === 0) return;

  // TODO should I return only one?
  return res[0];
}

export async function deleteEmailVerificationToken(db: Database, token: string): Promise<DbEmailVerificationToken | undefined> {
  if (!token) return;

  const res = await db.delete(emailVerificationTokens).where(eq(emailVerificationTokens.token, token)).returning();

  if (res.length === 0) return;

  return res[0];
}
