import { Lucia, generateId } from "lucia";
import { TimeSpan, createDate, isWithinExpirationDate } from "oslo";
import { generateRandomString, alphabet } from "oslo/crypto";
import {
  createEmailVerificationToken,
  deleteAllEmailVerificationTokensByUserId,
  deleteEmailVerificationToken,
  getEmailVerificationTokenByUserId
} from "../db/email-verification-tokens";
import type { Database } from "../db";
import { SESSION_ID_LEN, TOKEN_EXPIRATION_TIME, TOKEN_LEN } from "$configs/fields-length";
import {
  createPasswordResetToken,
  deleteAllPasswordResetTokensByUserId,
  deletePasswordResetToken,
  getPasswordResetTokenByUserId
} from "../db/password-reset-tokens";
import {
  createEmailChangeToken,
  deleteAllEmailChangeTokensByUserId,
  deleteEmailChangeToken,
  getEmailChangeTokenByUserId,
  type DbEmailChangeToken
} from "../db/email-change-tokens";
import type { Cookies } from "@sveltejs/kit";
import { createToken, deleteAllTokensByUserId, type DbToken, type TOKEN_TYPE, getTokenByUserId, deleteToken } from "../db/tokens";

export async function generateEmailVerificationToken(db: Database, userId: string, email: string): Promise<string> {
  await deleteAllEmailVerificationTokensByUserId(db, userId);

  const token = generateRandomString(TOKEN_LEN, alphabet("0-9", "a-z", "A-Z"));
  const expiresAt = createDate(new TimeSpan(TOKEN_EXPIRATION_TIME, "m"));

  await createEmailVerificationToken(db, { userId, email, token, expiresAt });

  return token;
}

export async function verifyEmailVerificationToken(db: Database, userId: string, email: string, token: string): Promise<boolean> {
  const tokenFromDatabase = await getEmailVerificationTokenByUserId(db, userId);
  if (!tokenFromDatabase || tokenFromDatabase.token !== token) {
    return false;
  }

  const res = await deleteEmailVerificationToken(db, token);
  if (!res) {
    return false;
  }

  const isExpired = !isWithinExpirationDate(tokenFromDatabase.expiresAt);
  // TODO this is unnecessary, delete email field from the table and all the logic
  const isDifferentUser = tokenFromDatabase.email !== email;

  if (isExpired || isDifferentUser) {
    return false;
  }

  return true;
}

export async function generatePasswordResetToken(db: Database, userId: string): Promise<string | undefined> {
  await deleteAllPasswordResetTokensByUserId(db, userId);
  const token = generateId(TOKEN_LEN);
  const expiresAt = createDate(new TimeSpan(TOKEN_EXPIRATION_TIME, "m"));

  const res = await createPasswordResetToken(db, { token, userId, expiresAt });
  if (!res) return;

  return token;
}

export async function verifyPasswordResetToken(db: Database, userId: string, token: string): Promise<boolean> {
  const tokenFromDatabase = await getPasswordResetTokenByUserId(db, userId);
  if (!tokenFromDatabase || tokenFromDatabase.token !== token) {
    return false;
  }

  const res = await deletePasswordResetToken(db, token);
  if (!res) {
    return false;
  }

  const isExpired = !isWithinExpirationDate(tokenFromDatabase.expiresAt);
  if (isExpired) {
    return false;
  }

  return true;
}

export async function generateChangeEmailToken(db: Database, userId: string, newEmail: string): Promise<string | undefined> {
  await deleteAllEmailChangeTokensByUserId(db, userId);
  const token = generateId(TOKEN_LEN);
  const expiresAt = createDate(new TimeSpan(TOKEN_EXPIRATION_TIME, "m"));

  const res = await createEmailChangeToken(db, { token, userId, expiresAt, email: newEmail });
  if (!res) return;

  return token;
}

export async function verifyChangeEmailToken(db: Database, userId: string, token: string): Promise<DbEmailChangeToken | undefined> {
  const tokenFromDatabase = await getEmailChangeTokenByUserId(db, userId);
  if (!tokenFromDatabase || tokenFromDatabase.token !== token) {
    return;
  }

  const res = await deleteEmailChangeToken(db, token);
  if (!res) {
    return;
  }

  const isExpired = !isWithinExpirationDate(tokenFromDatabase.expiresAt);
  if (isExpired) {
    return;
  }

  return tokenFromDatabase;
}

// TODO can I merge all this "generate" and "verify" functions into one?
export async function generateToken(db: Database, userId: string, type: TOKEN_TYPE): Promise<DbToken | undefined> {
  await deleteAllTokensByUserId(db, userId, type);

  const token = await createToken(db, { userId, type });
  if (!token) return;

  return token;
}

export async function verifyToken(db: Database, userId: string, token: string, type: TOKEN_TYPE): Promise<boolean> {
  const tokenFromDatabase = await getTokenByUserId(db, userId, type);
  if (!tokenFromDatabase || tokenFromDatabase.token !== token) {
    return false;
  }

  const deletedToken = await deleteToken(db, token, type);
  if (!deletedToken) {
    return false;
  }

  const isExpired = !isWithinExpirationDate(tokenFromDatabase.expiresAt);
  if (isExpired) {
    return false;
  }

  return true;
}

export function setNewSession(lucia: Lucia, sessionId: string, cookies: Cookies) {
  const { name, value, attributes } = lucia.createSessionCookie(sessionId);

  cookies.set(name, value, { ...attributes, path: "/" });
}

export function destroySession(lucia: Lucia, cookies: Cookies) {
  const { name, value, attributes } = lucia.createBlankSessionCookie();

  cookies.set(name, value, { ...attributes, path: "/" });
}

export const createAndSetSession = async (lucia: Lucia, userId: string, cookies: Cookies) => {
  const sessionId = generateId(SESSION_ID_LEN);
  const session = await lucia.createSession(userId, {}, { sessionId });

  setNewSession(lucia, session.id, cookies);
};
