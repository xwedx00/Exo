import { randomBytes } from "crypto";

/**
 * Generates a random string of the specified length
 * @param length The length of the string to generate
 */
export function generateRandomString(length: number): string {
  const bytes = randomBytes(length);
  return bytes.toString("hex");
}

/**
 * Generates a random 256-bit AES encryption key
 */
export function generateEncryptionKey(): Uint8Array {
  return randomBytes(32);
}

/**
 * Generates a random 256-bit ECC key pair
 */
export function generateEccKeyPair(): Promise<CryptoKeyPair> {
  return window.crypto.subtle.generateKey(
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    true,
    ["deriveKey"]
  );
}

/**
 * Derives a shared secret from the given private key and public key
 * @param privateKey The private key to derive the secret from
 * @param publicKey The public key to derive the secret from
 */
export async function deriveSharedSecret(
  privateKey: CryptoKey,
  publicKey: CryptoKey
): Promise<CryptoKey> {
  const derivedKey = await window.crypto.subtle.deriveKey(
    {
      name: "ECDH",
      namedCurve: "P-256",
      public: publicKey,
    },
    privateKey,
    {
      name: "AES-GCM",
      length: 256,
    },
    false,
    ["encrypt", "decrypt"]
  );
  return derivedKey;
}
