import { and, eq } from "drizzle-orm";
import { type Database } from "$lib/server/db";
import type { DbInsertOauthAccount, DbOauthAccount } from "./types";
import { oauthAccounts } from ".";
import type { AUTH_METHODS } from "$configs/general";

/*
 * CREATE
 **/
export async function createOauthAccount(db: Database, newOauthAccount: DbInsertOauthAccount): Promise<DbOauthAccount | undefined> {
  const res = await db.insert(oauthAccounts).values(newOauthAccount).onConflictDoNothing().returning();

  if (res.length === 0) return;

  return res[0];
}

/*
 * READ
 **/
// export async function getAllOauthAccounts(db: Database): Promise<DbOauthAccount[] | []> {
//   return await db.query.oauthAccounts.findMany();
// }

export async function getOAuthAccountByProviderUserId(
  db: Database,
  providerId: AUTH_METHODS,
  providerUserId: string
): Promise<DbOauthAccount | undefined> {
  if (!providerId || !providerUserId) return;

  return await db.query.oauthAccounts.findFirst({
    where: and(eq(oauthAccounts.providerId, providerId), eq(oauthAccounts.providerUserId, providerUserId))
  });
}

/*
 * UPDATE
 **/

/*
 * DELETE
 **/
// export async function deleteOauthAccountByProviderId(db: Database, providerId: string): Promise<DbOauthAccount | undefined> {
//   if (!providerId) return;

//   const res = await db.delete(users).where(eq(users.id, id)).returning();

//   if (res.length === 0) return;

//   return res[0];
// }
