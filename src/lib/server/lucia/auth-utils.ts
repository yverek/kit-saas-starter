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
