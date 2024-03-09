import { eq } from "drizzle-orm";
import { users } from "../schema";
import type { Database } from "../types";
import type { DbInsertUser, DbUpdateUser, DbUser } from "./types";

/*
 * CREATE
 **/
export async function createUser(db: Database, newUser: DbInsertUser): Promise<DbUser | undefined> {
  const res = await db.insert(users).values(newUser).onConflictDoNothing().returning();

  if (res.length === 0) return;

  return res[0];
}

/*
 * READ
 **/
export async function getAllUsers(db: Database): Promise<DbUser[] | []> {
  return await db.query.users.findMany();
}

export async function getUserByEmail(db: Database, email: string): Promise<DbUser | undefined> {
  if (!email) return;

  return await db.query.users.findFirst({ where: eq(users.email, email) });
}

// export async function getUserById(db: Database, id: string): Promise<DbUser | undefined> {
//   if (!id) return;

//   return await db.query.users.findFirst({ where: eq(users.id, id) });
// }

/*
 * UPDATE
 **/
// export async function updateUserByEmail(db: Database, email: string, userData: DbUpdateUser): Promise<DbUser | undefined> {
//   if (!email) return;

//   const res = await db.update(users).set(userData).where(eq(users.email, email)).returning();

//   if (res.length === 0) {
//     logger.error(`Failed to update User with email=${email}!`);
//     return;
//   }

//   return res[0];
// }

export async function updateUserById(db: Database, id: string, userData: DbUpdateUser): Promise<DbUser | undefined> {
  if (!id) return;

  userData.modifiedAt = new Date();

  const res = await db.update(users).set(userData).where(eq(users.id, id)).returning();

  if (res.length === 0) return;

  return res[0];
}

/*
 * DELETE
 **/
// export async function deleteUserByEmail(db: Database, email: string): Promise<DbUser | undefined> {
//   if (!email) return;

//   const res = await db.delete(users).where(eq(users.email, email)).returning();

//   if (res.length === 0) {
//     logger.error(`Failed to delete User with email=${email}!`);
//     return;
//   }

//   return res[0];
// }

export async function deleteUserById(db: Database, id: string): Promise<DbUser | undefined> {
  if (!id) return;

  const res = await db.delete(users).where(eq(users.id, id)).returning();

  if (res.length === 0) return;

  return res[0];
}
