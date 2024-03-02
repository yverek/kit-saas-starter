import { TimeSpan, createDate, isWithinExpirationDate } from "oslo";
import { generateRandomString, alphabet } from "oslo/crypto";
import {
  createNewVerificationCode,
  deleteAllVerificationCodesByUserId,
  deleteVerificationCodeByCode,
  getVerificationCodeByUserId
} from "../db/verification-codes";
import type { Database } from "../db";
import {
  PASSWORD_RESET_CODE_EXPIRATION_TIME,
  PASSWORD_RESET_CODE_LEN,
  VERIFICATION_CODE_EXPIRATION_TIME,
  VERIFICATION_CODE_LEN
} from "$configs/fields-length";
import { createNewPasswordResetCode, deleteAllPasswordResetCodesByUserId } from "../db/password-reset-codes";
import { generateId } from "lucia";

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

export async function generateEmailVerificationCode(db: Database, userId: string, email: string): Promise<string> {
  await deleteAllVerificationCodesByUserId(db, userId);

  const code = generateRandomString(VERIFICATION_CODE_LEN, alphabet("0-9", "A-Z"));
  const expiresAt = createDate(new TimeSpan(VERIFICATION_CODE_EXPIRATION_TIME, "m")); // 5 minutes

  await createNewVerificationCode(db, { userId, email, code, expiresAt });

  return code;
}

export async function verifyVerificationCode(db: Database, userId: string, email: string, code: string): Promise<boolean> {
  const codeFromDatabase = await getVerificationCodeByUserId(db, userId);
  if (!codeFromDatabase || codeFromDatabase.code !== code) {
    return false;
  }

  const res = await deleteVerificationCodeByCode(db, code);
  if (!res) {
    return false;
  }

  const isExpired = !isWithinExpirationDate(codeFromDatabase.expiresAt);
  const isDifferentUser = codeFromDatabase.email !== email;

  if (isExpired || isDifferentUser) {
    return false;
  }

  return true;
}

export async function generatePasswordResetCode(db: Database, userId: string): Promise<string | undefined> {
  await deleteAllPasswordResetCodesByUserId(db, userId);
  const code = generateId(PASSWORD_RESET_CODE_LEN);
  const expiresAt = createDate(new TimeSpan(PASSWORD_RESET_CODE_EXPIRATION_TIME, "m"));

  const res = await createNewPasswordResetCode(db, { code, userId, expiresAt });
  if (!res) return;

  return code;
}
