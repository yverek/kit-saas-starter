import { eq } from "drizzle-orm";
import { type Database } from "$lib/server/db";
import type { DbInsertToken, DbToken } from "./types";
import { tokens } from ".";

/*
 * CREATE
 **/
export async function createToken(db: Database, newToken: DbInsertToken) {
  const res = await db.insert(tokens).values(newToken).onConflictDoNothing().returning();

  if (res.length === 0) return;

  return res[0];
}

/*
 * READ
 **/
export async function getToken(db: Database, token: string): Promise<DbToken | undefined> {
  if (!token) return;

  return await db.query.tokens.findFirst({ where: eq(tokens.token, token) });
}

export async function getTokenByUserId(db: Database, userId: string): Promise<DbToken | undefined> {
  if (!userId) return;

  return await db.query.tokens.findFirst({ where: eq(tokens.userId, userId) });
}

/*
 * UPDATE
 **/

/*
 * DELETE
 **/
export async function deleteAllTokensByUserId(db: Database, userId: string): Promise<DbToken[] | undefined> {
  if (!userId) return;

  const res = await db.delete(tokens).where(eq(tokens.userId, userId)).returning();

  if (res.length === 0) return;

  return res;
}

export async function deleteToken(db: Database, token: string): Promise<DbToken | undefined> {
  if (!token) return;

  const res = await db.delete(tokens).where(eq(tokens.token, token)).returning();

  if (res.length === 0) return;

  return res[0];
}
