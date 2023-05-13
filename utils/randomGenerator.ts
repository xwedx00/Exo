import crypto from 'crypto';

/**
 * Generates a random string of the specified length.
 * @param length The length of the random string.
 * @returns The random string.
 */
export function generateRandomString(length: number): string {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
}

/**
 * Generates a random bytes buffer of the specified length.
 * @param length The length of the buffer to generate.
 * @returns The generated buffer.
 */
export function generateRandomBytes(length: number): Buffer {
  return crypto.randomBytes(length);
}
