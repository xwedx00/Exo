import { generateRandomBytes } from "./randomGenerator";
import { encryptWithPublicKey, decryptWithPrivateKey } from "./encryption";

export interface DigitalId {
  id: string;
  publicKey: string;
  privateKey: string;
}

/**
 * Generates a new digital ID with a random key pair.
 * @returns The new digital ID.
 */
export function generateDigitalId(): DigitalId {
  const privateKey = generateRandomBytes(32);
  const publicKey = encryptWithPublicKey(privateKey);

  return {
    id: generateRandomBytes(16),
    publicKey,
    privateKey,
  };
}

/**
 * Encrypts a message with the recipient's public key.
 * @param message The message to encrypt.
 * @param recipientPublicKey The recipient's public key.
 * @returns The encrypted message.
 */
export function encryptMessage(
  message: string,
  recipientPublicKey: string
): string {
  return encryptWithPublicKey(message, recipientPublicKey);
}

/**
 * Decrypts a message with the recipient's private key.
 * @param encryptedMessage The encrypted message.
 * @param recipientPrivateKey The recipient's private key.
 * @returns The decrypted message.
 */
export function decryptMessage(
  encryptedMessage: string,
  recipientPrivateKey: string
): string {
  return decryptWithPrivateKey(encryptedMessage, recipientPrivateKey);
}
