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

const encoder = new TextEncoder();

// TODO write documentation
export async function createPasswordHash(password: string, salt: string | null = null) {
  if (!salt) {
    salt = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  const cryptoKey = await crypto.subtle.importKey("raw", encoder.encode(password), { name: "PBKDF2" }, false, ["deriveKey", "deriveBits"]);

  const hash = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: encoder.encode(salt),
      iterations: 100000,
      hash: "SHA-256"
    },
    cryptoKey,
    256
  );

  return (
    Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("") + salt
  );
}

// TODO write documentation
export async function verifyPasswordHash(password: string, hashedPasswordWithSalt: string) {
  const salt = hashedPasswordWithSalt.slice(-32);

  const hashedPassword = await createPasswordHash(password, salt);

  return hashedPassword === hashedPasswordWithSalt;
}

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
// TODO add getToken and deleteToken function inside a single db transaction

// TODO use this functions in other places
export const createAndSetSession = async (lucia: Lucia, userId: string, cookies: Cookies) => {
  const sessionId = generateId(SESSION_ID_LEN);

  const session = await lucia.createSession(userId, {}, { sessionId });
  const { name, value, attributes } = lucia.createSessionCookie(session.id);

  cookies.set(name, value, { ...attributes, path: "/" });
};
